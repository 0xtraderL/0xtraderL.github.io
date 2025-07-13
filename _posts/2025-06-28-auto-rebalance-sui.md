---
layout: post
title: "在sui上LP自动再平衡工具"
date: 2025-6-28 12:00:00 +0800
categories: [DeFi]
tags: [defi, bluefin, sui, clmm]
---

在集中流动性池组LP赚手续费收益时，经常会遇到价格越界, 即脱离LP流动性仓位的价格区间的情况。这时候不去手动重新建立仓位的话，收不到任何收益。手动重组仓位有点繁琐，假设要投入的资金不变，按原有仓位的剩余币种数量计算：

1. 关闭原有的仓位，提取所有流动性, 这里的交易需要签名一次。
2. 考虑新仓位的价格区间，然后计算所需要的币种A和B，再swap 对应数量的A或者B, 这里进行swap交易, 需要签名一次。
3. 根据2获得的数量和预设的价格区间，重新添加流动性建立仓位，这里需要签名一次。

自己手动重组LP需要上述3个步骤，而且步骤2不借助工具还不好计算。现在有不少自平衡链上协议比如AlphaFi，可以在超出区间时候自动平衡，但是他的价格范围是协议决定的，没办法根据自己的策略进行调整，通常价格范围比较大，而且只适用与少量主流池子，比较适合不想折腾的懒人。我基本不会用这类协议。

## SUI PTB 特性实现一键再平衡

在以太坊上我还真不知道在不利用链上合约的情况下，如何在链下解决。但是在sui上，这个问题不是问题。这里捧一下sui，sui真的是为解决实际问题而生的链，非常适合开发各种应用，gas成本低，安全性高，速度还快, 有非常多的特性比如赞助交易、ZkLogin、PTB编程等，能很容易实现用户友好的具有创新性的App。

重点说下PTB特性，这个功能确实很强大：

PTB（Programable Transaction Block）简单来说，就是在链下构建交易时，可以一次性打包多个操作。看起来普通，但实际应用场景很广泛。

**传统链上操作的问题：**
- 复杂操作需要分解成多个独立交易
- 每个交易都要单独签名确认，流程繁琐
- 中间任何一步失败，前面的操作可能已经执行
- Gas费累积，成本较高

**PTB的优势：**
- 多个操作在链下组装成一个交易块
- 一次签名，要么全部成功，要么全部失败
- 原子性执行，避免中间状态
- Gas费用显著降低，因为本质上是单个交易

举个实际例子：LP再平衡操作，传统evm方式需要：
1. 撤出流动性 → 签名确认 → 等待
2. Swap代币调整比例 → 签名确认 → 等待  
3. 重新添加流动性 → 签名确认 → 等待

使用PTB：
1. 链下构建：
   - 关闭仓位撤出流动性拿到已撤出的代币数量 （此时还没执行交易， 代币还在这个交易里，可以传递给下个操作）
   - 根据上步骤获得的代币数量进行swap
   - 根据上步骤的swap后的数量，重新创建仓位
2. 一次签名提交上述交易
3. 链上原子性执行

利用PTB还能在链下进行闪电贷的套利，而这在以太坊系上只能开发合约进行。

这就是为什么我能在sui上实现一键再平衡，而在其他链上这种操作成本和复杂度都很高。

## 我的工作流

1. 投入资金首次创建仓位
2. 监控仓位状态，如果越界则telegram发通知提醒
3. 越界后，使用再平衡工作流，让原仓位继续在当前价格范围赚取收益
4. 观察历史仓位收益，调整仓位的价格幅度

![LP再平衡执行过程](/assets/img/posts/2025-06-28/1.webp)
![LP收益统计](/assets/img/posts/2025-06-28/3.png)

使用的工作流工具：

- 仓位越界监控
- 一键再平衡
  - [Bluefin](https://app.kamechan.xyz/workflow/traderL/bluefin-spot-automated-percentage-based-rebalancing)
  - [Momentum](https://app.kamechan.xyz/workflow/traderL/mmt-automated-liquidity-position-rebalancing)
- 历史仓位收益(LP vs Holding) 
  - [Bluefin](https://app.kamechan.xyz/workflow/traderL/bluefin-spot-yield-comparison-lp-vs-holding)
  - [Momentum](https://app.kamechan.xyz/workflow/traderL/momentum-pool-yield-comparison-lp-vs-holding) 


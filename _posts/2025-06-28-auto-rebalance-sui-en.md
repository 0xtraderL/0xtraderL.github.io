---
layout: post
title: "Auto-Rebalance LP Tool on Sui"
date: 2025-6-28 12:00:00 +0800
categories: [DeFi]
tags: [defi, bluefin, sui, clmm]
lang: en
---

When providing liquidity to concentrated liquidity pools to earn fee income, you often encounter price out-of-range situations, where the price leaves the LP liquidity position's price range. In this case, if you don't manually re-establish the position, you won't earn any returns. Manual position rebalancing is somewhat tedious. Assuming the invested capital remains unchanged, based on the remaining token quantities from the original position:

1. Close the original position and withdraw all liquidity - this transaction requires one signature.
2. Consider the new position's price range, then calculate the required amounts of tokens A and B, and swap the corresponding amounts of A or B - this swap transaction requires one signature.
3. Based on the quantities obtained from step 2 and the preset price range, re-add liquidity to establish the position - this requires one signature.

Manual LP rebalancing requires the above 3 steps, and step 2 is difficult to calculate without tools. There are now many auto-balancing on-chain protocols like AlphaFi that can automatically rebalance when out of range, but their price ranges are determined by the protocol and cannot be adjusted according to your own strategy. Usually, the price ranges are quite large and only suitable for a few mainstream pools, making them more suitable for lazy users who don't want to bother. I rarely use such protocols.

## Sui PTB Feature Enables One-Click Rebalancing

On Ethereum, I really don't know how to solve this problem off-chain without using on-chain contracts. But on Sui, this problem is not a problem. Here I'll praise Sui - Sui is truly a blockchain born to solve real problems, very suitable for developing various applications with low gas costs, high security, fast speed, and many features like sponsored transactions, ZkLogin, PTB programming, etc., which can easily implement user-friendly innovative apps.

Let me focus on the PTB feature, which is indeed very powerful:

PTB (Programmable Transaction Block) simply means that when building transactions off-chain, you can package multiple operations at once. It looks ordinary, but the actual application scenarios are very wide.

**Problems with traditional on-chain operations:**
- Complex operations need to be decomposed into multiple independent transactions
- Each transaction requires separate signature confirmation, making the process tedious
- If any step fails, previous operations may have already been executed
- Gas fees accumulate, increasing costs

**PTB advantages:**
- Multiple operations are assembled into one transaction block off-chain
- One signature, either all succeed or all fail
- Atomic execution, avoiding intermediate states
- Significantly reduced gas fees since it's essentially a single transaction

A practical example: LP rebalancing operation, traditional EVM way requires:
1. Withdraw liquidity → Sign confirmation → Wait
2. Swap tokens to adjust ratio → Sign confirmation → Wait
3. Re-add liquidity → Sign confirmation → Wait

Using PTB:
1. Build off-chain:
   - Close position and withdraw liquidity to get withdrawn token amounts (transaction hasn't executed yet, tokens are still in this transaction and can be passed to the next operation)
   - Swap based on token amounts from the previous step
   - Re-create position based on amounts from the swap step
2. Submit the above transaction with one signature
3. Atomic execution on-chain

Using PTB, you can even perform flash loan arbitrage off-chain, which on Ethereum systems can only be done by developing contracts.

This is why I can implement one-click rebalancing on Sui, while on other chains, such operations have high costs and complexity.

## My Workflow

1. Initially invest capital to create position
2. Monitor position status, send Telegram notifications when out of range
3. After going out of range, use rebalancing workflow to keep the original position earning returns in the current price range
4. Observe historical position returns and adjust position price amplitude

LP profit statistics:
![LP Profit Statistics](/assets/img/posts/2025-06-28/1.webp)

LP rebalancing execution process:
![LP Rebalancing Process](/assets/img/posts/2025-06-28/3.png)

Workflow tools used:

- Position out-of-range monitoring
- One-click rebalancing
  - [Bluefin](https://app.kamechan.xyz/workflow/traderL/bluefin-spot-automated-percentage-based-rebalancing)
  - [Momentum](https://app.kamechan.xyz/workflow/traderL/mmt-automated-liquidity-position-rebalancing)
- Historical position returns (LP vs Holding)
  - [Bluefin](https://app.kamechan.xyz/workflow/traderL/bluefin-spot-yield-comparison-lp-vs-holding)
  - [Momentum](https://app.kamechan.xyz/workflow/traderL/momentum-pool-yield-comparison-lp-vs-holding) 
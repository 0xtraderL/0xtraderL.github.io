module Jekyll
  module LanguageFilter
    def posts_by_language(posts, lang)
      return posts unless lang
      
      # Filter posts by language
      filtered_posts = posts.select do |post|
        post_lang = post.data['lang'] || 'en'
        post_lang == lang
      end
      
      filtered_posts
    end
    
    def current_language(page)
      page['lang'] || 'en'
    end
  end
end

Liquid::Template.register_filter(Jekyll::LanguageFilter) 
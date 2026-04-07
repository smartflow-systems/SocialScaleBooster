export interface IndustryPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  targetAudience: string;
  contentTypes: string[];
  toneRecommendations: string[];
  hashtagSuggestions: string[];
  postTemplates: PostTemplate[];
  automationFlows: AutomationFlow[];
}

export interface PostTemplate {
  id: string;
  type: string;
  title: string;
  template: string;
  variables: string[];
  platforms: string[];
  engagement_factors: string[];
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  description: string;
}

export const industryPresets: IndustryPreset[] = [
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: '💄',
    description: 'Salons, spas, cosmetics, wellness centers, personal care',
    targetAudience: 'Women and men aged 18-45 interested in beauty, wellness, and self-care',
    contentTypes: ['before_after', 'tutorials', 'product_highlights', 'client_testimonials', 'behind_scenes'],
    toneRecommendations: ['friendly', 'luxury'],
    hashtagSuggestions: [
      '#BeautyTips', '#GlowUp', '#SkincareTips', '#MakeupArtist', '#BeautyTreatment',
      '#WellnessJourney', '#SelfCare', '#BeautyGoals', '#HairGoals', '#NaturalBeauty'
    ],
    postTemplates: [
      {
        id: 'before_after',
        type: 'transformation',
        title: 'Before & After Transformation',
        template: '✨ TRANSFORMATION TUESDAY ✨\n\nWow! Look at this incredible {treatment_type} transformation! 😍\n\n{client_name} came to us wanting {client_goal}, and we delivered exactly what she was looking for.\n\n🔹 Treatment: {treatment_name}\n🔹 Duration: {treatment_duration}\n🔹 Result: {result_description}\n\nReady for your own transformation? Book your consultation today! 📅\n\n{hashtags}\n\n#BeautyTransformation #GlowUp #{location}Beauty',
        variables: ['treatment_type', 'client_name', 'client_goal', 'treatment_name', 'treatment_duration', 'result_description', 'hashtags', 'location'],
        platforms: ['instagram', 'facebook'],
        engagement_factors: ['before_after_photos', 'client_permission', 'clear_results']
      },
      {
        id: 'tip_tutorial',
        type: 'educational',
        title: 'Beauty Tip Tutorial',
        template: '💡 {tip_category} TIP OF THE DAY!\n\n{tip_description}\n\nHere\'s how to do it:\n{step_by_step_instructions}\n\n✨ Pro tip: {professional_advice}\n\nTry this at home and let us know how it goes! Tag us in your results 👇\n\n{hashtags}\n\n#BeautyTips #{tip_category}Tips #DIYBeauty',
        variables: ['tip_category', 'tip_description', 'step_by_step_instructions', 'professional_advice', 'hashtags'],
        platforms: ['instagram', 'tiktok', 'facebook'],
        engagement_factors: ['actionable_steps', 'clear_instructions', 'encouraging_engagement']
      }
    ],
    automationFlows: [
      {
        id: 'new_client_welcome',
        name: 'New Client Welcome Series',
        trigger: 'new_follower',
        actions: ['send_welcome_dm', 'share_portfolio', 'offer_consultation'],
        description: 'Automatically welcomes new followers and offers them a consultation'
      },
      {
        id: 'appointment_reminder',
        name: 'Appointment Booking Flow',
        trigger: 'comment_contains_booking_keyword',
        actions: ['reply_with_booking_link', 'send_dm_with_availability'],
        description: 'Responds to booking inquiries with direct booking links'
      }
    ]
  },
  
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    icon: '🛍️',
    description: 'Online stores, retail brands, product-based businesses',
    targetAudience: 'Shopping enthusiasts, brand followers, age varies by product category',
    contentTypes: ['product_showcases', 'user_generated', 'seasonal_campaigns', 'behind_scenes', 'educational'],
    toneRecommendations: ['friendly', 'playful'],
    hashtagSuggestions: [
      '#ShopLocal', '#NewArrivals', '#Sale', '#Fashion', '#Style', '#Shopping',
      '#ProductLaunch', '#CustomerLove', '#BehindTheScenes', '#SmallBusiness'
    ],
    postTemplates: [
      {
        id: 'product_launch',
        type: 'promotional',
        title: 'New Product Launch',
        template: '🚨 NEW ARRIVAL ALERT! 🚨\n\nIntroducing our latest {product_category}: {product_name}! ✨\n\n{product_description}\n\n🔥 Special Launch Features:\n{product_features}\n\n💰 Launch Price: {price} (was {original_price})\n⏰ Limited time offer - only {quantity_available} available!\n\nShop now: {shop_link}\n\n{hashtags}\n\n#NewLaunch #LimitedEdition #{brand}Style',
        variables: ['product_category', 'product_name', 'product_description', 'product_features', 'price', 'original_price', 'quantity_available', 'shop_link', 'hashtags', 'brand'],
        platforms: ['instagram', 'facebook', 'twitter'],
        engagement_factors: ['product_photos', 'limited_quantity', 'clear_cta', 'price_benefit']
      },
      {
        id: 'user_generated_content',
        type: 'social_proof',
        title: 'Customer Feature',
        template: '💕 CUSTOMER SPOTLIGHT 💕\n\nLook at {customer_name} absolutely rocking our {product_name}! 😍\n\n"{customer_quote}"\n\nWe love seeing how our customers style our pieces! 🌟\n\n📷 Photo: @{customer_handle}\n\nWant to be featured? Share your photos using {branded_hashtag} for a chance to be featured!\n\n{hashtags}\n\n#CustomerLove #CustomerSpotlight #{brand}Community',
        variables: ['customer_name', 'product_name', 'customer_quote', 'customer_handle', 'branded_hashtag', 'hashtags', 'brand'],
        platforms: ['instagram', 'facebook'],
        engagement_factors: ['customer_permission', 'authentic_photo', 'clear_hashtag_cta']
      }
    ],
    automationFlows: [
      {
        id: 'cart_abandonment',
        name: 'Cart Abandonment Recovery',
        trigger: 'cart_abandoned',
        actions: ['create_personalized_post', 'send_discount_offer'],
        description: 'Creates social posts featuring abandoned cart items with special offers'
      },
      {
        id: 'review_request',
        name: 'Post-Purchase Review Request',
        trigger: 'purchase_completed',
        actions: ['thank_you_post', 'request_photo_review'],
        description: 'Encourages customers to share photos and reviews after purchase'
      }
    ]
  },
  
  {
    id: 'fitness',
    name: 'Fitness & Health',
    icon: '💪',
    description: 'Gyms, personal trainers, wellness coaches, nutrition experts',
    targetAudience: 'Health-conscious individuals, fitness enthusiasts, people seeking lifestyle changes',
    contentTypes: ['transformation_stories', 'workout_videos', 'nutrition_tips', 'motivational', 'educational'],
    toneRecommendations: ['motivational', 'friendly'],
    hashtagSuggestions: [
      '#FitnessJourney', '#HealthyLifestyle', '#WorkoutMotivation', '#FitnessGoals',
      '#TransformationTuesday', '#MotivationMonday', '#HealthTips', '#FitnessTips'
    ],
    postTemplates: [
      {
        id: 'transformation_story',
        type: 'success_story',
        title: 'Client Transformation',
        template: '🔥 TRANSFORMATION TUESDAY 🔥\n\n{client_name}\'s incredible {timeframe} journey! 💪\n\n📊 Results:\n🔹 {weight_change}\n🔹 {strength_gains}\n🔹 {lifestyle_changes}\n\n"{client_testimonial}"\n\n🎯 Key to success: {success_factors}\n\nReady to start your transformation? Let\'s chat! 💬\n\n{hashtags}\n\n#TransformationTuesday #ClientSuccess #FitnessJourney',
        variables: ['client_name', 'timeframe', 'weight_change', 'strength_gains', 'lifestyle_changes', 'client_testimonial', 'success_factors', 'hashtags'],
        platforms: ['instagram', 'facebook'],
        engagement_factors: ['client_permission', 'specific_metrics', 'inspiring_story']
      },
      {
        id: 'workout_tip',
        type: 'educational',
        title: 'Quick Workout Tip',
        template: '💡 WORKOUT TIP: {tip_title}\n\n{tip_description}\n\n🎯 How to do it:\n{instructions}\n\n⚡ Benefits:\n{benefits}\n\n🔥 Try it and let me know how you feel!\n\nNeed a personalized workout plan? DM me! 📩\n\n{hashtags}\n\n#WorkoutTips #FitnessEducation #HealthyLiving',
        variables: ['tip_title', 'tip_description', 'instructions', 'benefits', 'hashtags'],
        platforms: ['instagram', 'tiktok', 'facebook'],
        engagement_factors: ['clear_instructions', 'demonstrable_exercise', 'clear_benefits']
      }
    ],
    automationFlows: [
      {
        id: 'workout_motivation',
        name: 'Daily Motivation Series',
        trigger: 'time_based_daily',
        actions: ['post_daily_motivation', 'share_workout_tip'],
        description: 'Posts daily motivational content and workout tips'
      },
      {
        id: 'class_booking',
        name: 'Class Booking Automation',
        trigger: 'class_inquiry',
        actions: ['share_schedule', 'provide_booking_link'],
        description: 'Responds to class inquiries with schedules and booking information'
      }
    ]
  },
  
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: '🏠',
    description: 'Real estate agents, brokers, property management, home services',
    targetAudience: 'Home buyers, sellers, investors, renters in local market',
    contentTypes: ['property_showcases', 'market_insights', 'client_success', 'local_area', 'educational'],
    toneRecommendations: ['professional', 'friendly'],
    hashtagSuggestions: [
      '#RealEstate', '#HomeSweetHome', '#PropertyForSale', '#DreamHome', '#RealEstateAgent',
      '#HomeHunting', '#PropertyInvestment', '#LocalRealEstate', '#HouseHunting'
    ],
    postTemplates: [
      {
        id: 'property_showcase',
        type: 'listing',
        title: 'New Property Listing',
        template: '🏠 NEW LISTING ALERT! 🏠\n\n{property_address}\n\n✨ {property_description}\n\n🔑 Property Highlights:\n{property_features}\n\n💰 Price: {price}\n📏 Size: {square_footage}\n🛏️ Bedrooms: {bedrooms}\n🛁 Bathrooms: {bathrooms}\n\n📅 Open House: {open_house_date}\n\nInterested? DM me for a private showing! 📩\n\n{hashtags}\n\n#NewListing #{neighborhood}Homes #RealEstate',
        variables: ['property_address', 'property_description', 'property_features', 'price', 'square_footage', 'bedrooms', 'bathrooms', 'open_house_date', 'hashtags', 'neighborhood'],
        platforms: ['instagram', 'facebook', 'linkedin'],
        engagement_factors: ['high_quality_photos', 'virtual_tour_link', 'clear_contact_info']
      },
      {
        id: 'market_update',
        type: 'educational',
        title: 'Local Market Insight',
        template: '📊 {MONTH} MARKET UPDATE - {CITY}\n\n{market_summary}\n\n📈 Key Statistics:\n🔹 Average Home Price: {avg_price}\n🔹 Days on Market: {avg_days}\n🔹 Inventory Levels: {inventory_status}\n\n{market_analysis}\n\n🏡 What this means for you:\n{buyer_advice}\n{seller_advice}\n\nQuestions about the market? Let\'s talk! 📞\n\n{hashtags}\n\n#MarketUpdate #{city}RealEstate #RealEstateExpert',
        variables: ['month', 'city', 'market_summary', 'avg_price', 'avg_days', 'inventory_status', 'market_analysis', 'buyer_advice', 'seller_advice', 'hashtags'],
        platforms: ['facebook', 'linkedin', 'instagram'],
        engagement_factors: ['current_data', 'local_insights', 'actionable_advice']
      }
    ],
    automationFlows: [
      {
        id: 'lead_nurture',
        name: 'Home Buyer Lead Nurture',
        trigger: 'property_inquiry',
        actions: ['send_similar_listings', 'share_buying_guide', 'schedule_consultation'],
        description: 'Nurtures property inquiries with relevant listings and educational content'
      },
      {
        id: 'sold_celebration',
        name: 'Property Sold Celebration',
        trigger: 'property_sold',
        actions: ['create_sold_post', 'thank_client', 'request_testimonial'],
        description: 'Celebrates successful sales and requests client testimonials'
      }
    ]
  }
];

export const getIndustryPreset = (industryId: string): IndustryPreset | undefined => {
  return industryPresets.find(preset => preset.id === industryId);
};

export const getPresetsByCategory = () => {
  return {
    'Creative Services': industryPresets.filter(p => ['beauty', 'creative'].includes(p.id)),
    'Retail & E-commerce': industryPresets.filter(p => ['ecommerce'].includes(p.id)),
    'Health & Wellness': industryPresets.filter(p => ['fitness', 'beauty'].includes(p.id)),
    'Professional Services': industryPresets.filter(p => ['realestate', 'professional'].includes(p.id))
  };
};
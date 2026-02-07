// 国际化配置
export type Language = 'zh' | 'en'

export const translations = {
  zh: {
    // 通用
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    update: '更新',
    back: '返回',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    confirm: '确认',

    // 登录页面
    login: {
      title: 'OpenME',
      subtitle: '管理后台',
      email: '邮箱地址',
      password: '密码',
      signIn: '登录',
      loggingIn: '登录中...',
      defaultCredentials: '默认凭据：',
      emailPlaceholder: 'admin@openme.com',
      passwordPlaceholder: '••••••••'
    },

    // Dashboard
    dashboard: {
      title: '管理后台',
      welcome: '欢迎回来',
      viewSite: '查看网站',
      logout: '退出',

      // 统计卡片
      stats: {
        totalProducts: '商品总数',
        categories: '分类',
        activeProducts: '在售商品',
        lowStock: '低库存'
      },

      // 管理卡片
      uploadProducts: '上传商品',
      uploadProductsDesc: '添加带有图片、变体、价格和库存信息的新商品。',
      manageProducts: '管理商品',
      manageProductsDesc: '查看、编辑和管理所有商品。更新价格、库存和详情。',
      manageCategories: '管理分类',
      manageCategoriesDesc: '创建和组织商品分类。设置分类层级结构。',

      // 使用指南
      gettingStarted: '入门指南',
      step1: '1. 首先，设置分类来组织商品',
      step2: '2. 上传商品图片和详情，包括变体（颜色、尺码）',
      step3: '3. 为每个商品设置价格和库存',
      step4: '4. 商品激活后会自动显示在前端',

      // 主页配置
      homepageConfig: '主页配置',
      homepageConfigDesc: '自定义主页的横幅、区块和网站设置。'
    },

    // 商品上传/编辑
    productUpload: {
      title: '上传商品',
      editTitle: '编辑商品',
      subtitle: '添加新商品到商店',
      backToDashboard: '返回控制台',

      // 版块标题
      generalInfo: '基本信息',
      detailedInfo: '详细信息',
      inventoryManagement: '库存管理',
      attributes: '属性设置',
      pricingLogistics: '价格与物流',
      productImages: '商品图片',

      // 基本信息字段
      productName: '商品名称',
      productNamePlaceholder: '输入商品名称',
      sku: 'SKU 编号',
      skuPlaceholder: '例如：CFR-NDT-001',
      urlSlug: 'URL 别名',
      urlSlugPlaceholder: '留空自动生成',
      shortDescription: '简短描述',
      shortDescPlaceholder: '一行简短摘要',
      fullDescription: '完整描述',
      fullDescPlaceholder: '详细商品描述...',

      // 详细描述字段
      design: '设计理念',
      designPlaceholder: '描述设计灵感和特点...',
      shipping: '配送信息',
      shippingPlaceholder: '例如：现货：48小时内发货...',
      fitFabric: '材质与尺码',
      fitFabricPlaceholder: '面料成分和试穿感受...',
      craftsmanship: '工艺细节',
      craftsmanshipPlaceholder: '例如：手工缝制水钻...',
      caring: '洗护指南',
      caringPlaceholder: '仅冷水手洗...',

      // 属性字段
      category: '分类',
      selectCategory: '选择分类',
      type: '商品类型',
      setType: '套装 (上衣 + 下装)',
      setHint: '启用上衣/下装独立库存拆分',
      color: '颜色 (单选)',
      
      // 库存表格
      topInventory: '上衣库存',
      bottomInventory: '下装库存',
      mainInventory: '主库存',
      size: '尺码',
      stock: '库存',
      priceOverride: '价格覆盖 (选填)',

      // 价格字段
      mainPrice: '主价格 ($)',
      comparePrice: '对比价格 ($)',
      compareHint: '显示为划线原价',
      costPrice: '成本价格 ($)',
      weight: '重量 (kg)',
      
      // 状态开关
      status: '状态',
      productStatus: '商品状态',
      draft: '草稿',
      active: '激活',
      archived: '已归档',
      featureProduct: '设为特色商品',
      finalSale: '标记为最终销售 (不可退换)',

      // 图片
      addImage: '添加图片',
      setPrimary: '设为主图',
      mainImage: '主图',
      uploading: '正在上传...',
      clickToUpload: '点击上传图片',
      imageFormat: 'PNG, JPG, GIF 最大5MB',
      
      // 按钮
      createProduct: '发布商品',
      updateProduct: '保存更改',
      creating: '发布中...',
      saving: '保存中...',
      cancel: '取消',

      // 提示
      required: '必填',
      uploadSuccess: '商品发布成功！',
      updateSuccess: '商品更新成功！',
      error: '操作失败：'
    },

    // 产品管理
    productManagement: {
      title: '产品管理',
      subtitle: '管理所有产品，编辑状态和分类',
      backToDashboard: '返回控制台',
      addProduct: '添加产品',
      searchPlaceholder: '搜索产品名称或SKU...',
      all: '全部',
      active: '已激活',
      inactive: '未激活',
      loading: '加载中...',
      noProducts: '没有找到产品',
      addFirstProduct: '添加第一个产品',
      product: '产品',
      price: '价格',
      stock: '库存',
      status: '状态',
      actions: '操作',
      featured: '精选',
      confirmDelete: '确定要删除这个产品吗？',
      deleteSuccess: '产品已删除',
      totalProducts: '总产品数',
      activeProducts: '已激活',
      inactiveProducts: '未激活'
    },

    // 分类管理
    categories: {
      title: '分类',
      subtitle: '管理商品分类',
      backToDashboard: '返回控制台',
      addCategory: '添加分类',

      // 表单
      newCategory: '新建分类',
      editCategory: '编辑分类',
      categoryName: '分类名称',
      categoryNamePlaceholder: '例如：新品上架',
      urlSlug: 'URL 别名',
      urlSlugPlaceholder: '例如：new-arrivals',
      description: '描述',
      descriptionPlaceholder: '分类描述...',
      sortOrder: '排序',
      sortOrderPlaceholder: '0',
      active: '激活',
      createCategory: '创建分类',
      updateCategory: '更新分类',

      // 表格
      name: '名称',
      slug: '别名',
      sortOrderLabel: '排序',
      statusLabel: '状态',
      actions: '操作',
      activeStatus: '激活',
      inactiveStatus: '未激活',

      // 提示
      noCategories: '未找到分类。创建第一个分类！',
      deleteConfirm: '确定要删除',
      deleteSuccess: '分类删除成功！',
      createSuccess: '分类创建成功！',
      updateSuccess: '分类更新成功！'
    },

    // 主页配置管理
    homepage: {
      title: '主页配置',
      subtitle: '管理主页横幅、区块和设置',
      backToDashboard: '返回控制台',

      // 标签页
      tabs: {
        banners: '横幅',
        sections: '区块',
        settings: '设置'
      },

      // 横幅编辑
      banners: {
        mainBanner: '主横幅',
        secondaryBanner: '二级横幅',
        shippingBanner: '配送横幅',
        desktopImage: '桌面端图片',
        mobileImage: '移动端图片',
        linkUrl: '链接地址',
        linkUrlPlaceholder: '例如：/collections/halloween',
        altText: '图片描述',
        altTextPlaceholder: '描述图片内容...',
        button1: '按钮 1',
        button2: '按钮 2',
        buttonText: '按钮文字',
        buttonTextPlaceholder: '例如：立即购买',
        buttonLink: '按钮链接',
        buttonLinkPlaceholder: '/collections/...',
        uploadDesktop: '上传桌面端图片',
        uploadMobile: '上传移动端图片'
      },

      // 区块编辑
      sections: {
        addSection: '添加区块',
        editSection: '编辑区块',
        sectionKey: '区块标识',
        sectionKeyPlaceholder: '例如：halloween_shop',
        title: '标题',
        titlePlaceholder: '区块标题',
        titleZh: '标题（中文）',
        content: '内容',
        contentPlaceholder: '区块内容/诗句...',
        contentZh: '内容（中文）',
        buttonText: '按钮文字',
        buttonTextZh: '按钮文字（中文）',
        buttonLink: '按钮链接',
        imageUrl: '图片地址',
        bgColor: '背景色',
        sortOrder: '排序',
        isActive: '激活',
        noSections: '暂无区块，点击添加新区块',
        deleteConfirm: '确定要删除这个区块吗？'
      },

      // 设置编辑
      settings: {
        announcement: '公告栏',
        announcementText: '公告文字（英文）',
        announcementTextZh: '公告文字（中文）',
        announcementBgColor: '公告背景色',
        announcementEnabled: '显示公告栏',

        contact: '联系信息',
        contactEmail: '联系邮箱',
        responseTime: '响应时间（小时）',

        social: '社交媒体',
        instagramUrl: 'Instagram 链接',
        tiktokUrl: 'TikTok 链接',

        footer: '页脚',
        footerCopyright: '版权信息'
      },

      // 通用
      saveChanges: '保存更改',
      saving: '保存中...',
      saveSuccess: '保存成功！',
      saveError: '保存失败：',
      english: '英文',
      chinese: '中文'
    },

    // 前端页面翻译
    frontend: {
      // 导航栏
      nav: {
        lingerie: '人气文胸',
        teddies: '连体衣',
        nightwear: '性感睡衣',
        sales: '特价',
        roleplay: '角色扮演',
        panties: '内裤',
        about: '关于我们'
      },
      // 公告栏
      announcement: 'KLARNA 和 AFTERPAY 可用',
      // 筛选器
      filters: {
        title: '筛选',
        clearAll: '清除全部',
        activeFilters: '已选筛选',
        color: '颜色',
        type: '类型',
        size: '尺码',
        stockStatus: '库存状态',
        colors: {
          black: '黑色',
          pink: '粉色',
          purple: '紫色',
          blue: '蓝色',
          green: '绿色',
          white: '白色',
          silver: '银色',
          gold: '金色'
        },
        types: {
          sets: '套装',
          tops: '上衣',
          bottoms: '下装',
          dresses: '连衣裙',
          accessories: '配饰',
          skirts: '裙装'
        },
        stock: {
          instock: '有货',
          lowstock: '库存不足',
          preorder: '预订'
        }
      },
      // 页脚
      footer: {
        contactUs: '联系我们',
        emailUs: '邮箱',
        responseTime: '我们将在24小时内用英文回复您',
        weekdays: '工作日：周一至周五',
        newsletter: '更多 OpenME 精彩',
        newsletterDesc: '不错过最新潮流和更新',
        subscribe: '订阅',
        followUs: '关注我们',
        service: '服务',
        contactLink: '联系我们',
        customization: '定制服务',
        faq: '常见问题',
        order: '订单',
        returnOrder: '退换货',
        payment: '支付方式',
        shipping: '配送信息',
        trackOrder: '订单追踪',
        refund: '退款与换货',
        aboutUs: '关于我们',
        brandHistory: '品牌历史',
        founder: '创始人',
        manufacturing: '制造工艺',
        sizing: '尺码指南',
        influencer: '网红合作',
        social: '社交媒体',
        wholesale: '批发',
        newsletterBenefits: '订阅福利',
        instagram: '在 Instagram 关注我们',
        legal: '法律',
        terms: '条款与条件',
        privacy: '隐私与 Cookies',
        copyright: '版权所有'
      }
    }
  },

  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    back: 'Back',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm',

    // Login page
    login: {
      title: 'OpenME',
      subtitle: 'Admin Dashboard',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      loggingIn: 'Logging in...',
      defaultCredentials: 'Default credentials:',
      emailPlaceholder: 'admin@openme.com',
      passwordPlaceholder: '••••••••'
    },

    // Dashboard
    dashboard: {
      title: 'OpenME Admin',
      welcome: 'Welcome back',
      viewSite: 'View Site',
      logout: 'Logout',

      // Stats cards
      stats: {
        totalProducts: 'Total Products',
        categories: 'Categories',
        activeProducts: 'Active Products',
        lowStock: 'Low Stock'
      },

      // Management cards
      uploadProducts: 'Upload Products',
      uploadProductsDesc: 'Add new products with images, variants, pricing, and inventory information.',
      manageProducts: 'Manage Products',
      manageProductsDesc: 'View, edit, and manage all your products. Update prices, stock, and details.',
      manageCategories: 'Manage Categories',
      manageCategoriesDesc: 'Create and organize product categories. Set up category hierarchies.',

      // Getting started
      gettingStarted: 'Getting Started',
      step1: '1. First, set up your categories to organize your products',
      step2: '2. Upload product images and details including variants (colors, sizes)',
      step3: '3. Set pricing and inventory for each product',
      step4: '4. Products will automatically appear on the frontend once active',

      // Homepage configuration
      homepageConfig: 'Homepage Config',
      homepageConfigDesc: 'Customize banners, sections, and site settings for the homepage.'
    },

    // Product upload/edit
    productUpload: {
      title: 'Upload Product',
      editTitle: 'Edit Product',
      subtitle: 'Add a new product to your store',
      backToDashboard: 'Back to Dashboard',

      // Section Titles
      generalInfo: 'General Information',
      detailedInfo: 'Detailed Information',
      inventoryManagement: 'Inventory Management',
      attributes: 'Product Attributes',
      pricingLogistics: 'Pricing & Logistics',
      productImages: 'Product Images',

      // General Info Fields
      productName: 'Product Name',
      productNamePlaceholder: 'Enter product name',
      sku: 'SKU',
      skuPlaceholder: 'e.g., CFR-NDT-001',
      urlSlug: 'URL Slug',
      urlSlugPlaceholder: 'Auto-generated if empty',
      shortDescription: 'Short Description',
      shortDescPlaceholder: 'One line summary',
      fullDescription: 'Full Description',
      fullDescPlaceholder: 'Detailed product description...',

      // Detailed Info Fields
      design: 'DESIGN',
      designPlaceholder: 'Describe the design inspiration and features...',
      shipping: 'SHIPPING',
      shippingPlaceholder: 'e.g. In stock: ships within 48 hours...',
      fitFabric: 'FIT & FABRIC',
      fitFabricPlaceholder: 'Material composition and fit notes...',
      craftsmanship: 'CRAFTMANSHIP',
      craftsmanshipPlaceholder: 'e.g. Hand-sewn rhinestones...',
      caring: 'CARING',
      caringPlaceholder: 'Hand wash in cold water only...',

      // Attributes Fields
      category: 'Category',
      selectCategory: 'Select Category',
      type: 'Type',
      setType: 'Set (Top + Bottom)',
      setHint: 'Enables Top & Bottom inventory splitting',
      color: 'Color (Single Choice)',

      // Inventory Table
      topInventory: 'Top Inventory',
      bottomInventory: 'Bottom Inventory',
      mainInventory: 'Main Inventory',
      size: 'Size',
      stock: 'Stock',
      priceOverride: 'Price Override',

      // Pricing Fields
      mainPrice: 'Main Price ($)',
      comparePrice: 'Compare at Price ($)',
      compareHint: 'Shows as crossed-out original price',
      costPrice: 'Cost Price ($)',
      weight: 'Weight (kg)',

      // Status Switches
      status: 'Status',
      productStatus: 'Product Status',
      draft: 'Draft',
      active: 'Active',
      archived: 'Archived',
      featureProduct: 'Featured Product',
      finalSale: 'Mark as Final Sale (No Returns)',

      // Images
      addImage: 'Add Image',
      setPrimary: 'Set as Main',
      mainImage: 'Main Image',
      uploading: 'Uploading...',
      clickToUpload: 'Click to upload image',
      imageFormat: 'PNG, JPG, GIF up to 5MB',

      // Buttons
      createProduct: 'Publish Product',
      updateProduct: 'Save Changes',
      creating: 'Publishing...',
      saving: 'Saving...',
      cancel: 'Cancel',

      // Messages
      required: 'Required',
      uploadSuccess: 'Product created successfully!',
      updateSuccess: 'Product updated successfully!',
      error: 'Operation failed: '
    },

    // Product Management
    productManagement: {
      title: 'Product Management',
      subtitle: 'Manage all products, edit status and categories',
      backToDashboard: 'Back to Dashboard',
      addProduct: 'Add Product',
      searchPlaceholder: 'Search product name or SKU...',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      loading: 'Loading...',
      noProducts: 'No products found',
      addFirstProduct: 'Add First Product',
      product: 'Product',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      actions: 'Actions',
      featured: 'Featured',
      confirmDelete: 'Are you sure you want to delete this product?',
      deleteSuccess: 'Product deleted',
      totalProducts: 'Total Products',
      activeProducts: 'Active',
      inactiveProducts: 'Inactive'
    },

    // Categories
    categories: {
      title: 'Categories',
      subtitle: 'Manage your product categories',
      backToDashboard: 'Back to Dashboard',
      addCategory: 'Add Category',

      // Form
      newCategory: 'New Category',
      editCategory: 'Edit Category',
      categoryName: 'Category Name',
      categoryNamePlaceholder: 'e.g., New Arrivals',
      urlSlug: 'URL Slug',
      urlSlugPlaceholder: 'e.g., new-arrivals',
      description: 'Description',
      descriptionPlaceholder: 'Category description...',
      sortOrder: 'Sort Order',
      sortOrderPlaceholder: '0',
      active: 'Active',
      createCategory: 'Create Category',
      updateCategory: 'Update Category',

      // Table
      name: 'Name',
      slug: 'Slug',
      sortOrderLabel: 'Sort Order',
      statusLabel: 'Status',
      actions: 'Actions',
      activeStatus: 'Active',
      inactiveStatus: 'Inactive',

      // Messages
      noCategories: 'No categories found. Create your first category!',
      deleteConfirm: 'Are you sure you want to delete',
      deleteSuccess: 'Category deleted successfully!',
      createSuccess: 'Category created successfully!',
      updateSuccess: 'Category updated successfully!'
    },

    // Homepage Configuration
    homepage: {
      title: 'Homepage Configuration',
      subtitle: 'Manage homepage banners, sections, and settings',
      backToDashboard: 'Back to Dashboard',

      // Tabs
      tabs: {
        banners: 'Banners',
        sections: 'Sections',
        settings: 'Settings'
      },

      // Banner editing
      banners: {
        mainBanner: 'Main Banner',
        secondaryBanner: 'Secondary Banner',
        shippingBanner: 'Shipping Banner',
        desktopImage: 'Desktop Image',
        mobileImage: 'Mobile Image',
        linkUrl: 'Link URL',
        linkUrlPlaceholder: 'e.g., /collections/halloween',
        altText: 'Alt Text',
        altTextPlaceholder: 'Describe the image...',
        button1: 'Button 1',
        button2: 'Button 2',
        buttonText: 'Button Text',
        buttonTextPlaceholder: 'e.g., Shop Now',
        buttonLink: 'Button Link',
        buttonLinkPlaceholder: '/collections/...',
        uploadDesktop: 'Upload Desktop Image',
        uploadMobile: 'Upload Mobile Image'
      },

      // Section editing
      sections: {
        addSection: 'Add Section',
        editSection: 'Edit Section',
        sectionKey: 'Section Key',
        sectionKeyPlaceholder: 'e.g., halloween_shop',
        title: 'Title',
        titlePlaceholder: 'Section title',
        titleZh: 'Title (Chinese)',
        content: 'Content',
        contentPlaceholder: 'Section content/poem...',
        contentZh: 'Content (Chinese)',
        buttonText: 'Button Text',
        buttonTextZh: 'Button Text (Chinese)',
        buttonLink: 'Button Link',
        imageUrl: 'Image URL',
        bgColor: 'Background Color',
        sortOrder: 'Sort Order',
        isActive: 'Active',
        noSections: 'No sections yet. Click to add a new section.',
        deleteConfirm: 'Are you sure you want to delete this section?'
      },

      // Settings editing
      settings: {
        announcement: 'Announcement Bar',
        announcementText: 'Announcement Text (English)',
        announcementTextZh: 'Announcement Text (Chinese)',
        announcementBgColor: 'Announcement Background Color',
        announcementEnabled: 'Show Announcement Bar',

        contact: 'Contact Information',
        contactEmail: 'Contact Email',
        responseTime: 'Response Time (hours)',

        social: 'Social Media',
        instagramUrl: 'Instagram URL',
        tiktokUrl: 'TikTok URL',

        footer: 'Footer',
        footerCopyright: 'Copyright Text'
      },

      // Common
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      saveSuccess: 'Saved successfully!',
      saveError: 'Save failed: ',
      english: 'English',
      chinese: 'Chinese'
    },

    // Frontend page translations
    frontend: {
      // Navigation
      nav: {
        lingerie: 'Lingerie',
        teddies: 'Teddies',
        nightwear: 'Nightwear',
        sales: 'Sales',
        roleplay: 'RolePlay',
        panties: 'Panties',
        about: 'ABOUT'
      },
      // Announcement bar
      announcement: 'KLARNA AND AFTERPAY AVAILABLE',
      // Filters
      filters: {
        title: 'Filters',
        clearAll: 'Clear All',
        activeFilters: 'Active Filters',
        color: 'Color',
        type: 'Type',
        size: 'Size',
        stockStatus: 'Stock Status',
        colors: {
          black: 'Black',
          pink: 'Pink',
          purple: 'Purple',
          blue: 'Blue',
          green: 'Green',
          white: 'White',
          silver: 'Silver',
          gold: 'Gold'
        },
        types: {
          sets: 'Sets',
          tops: 'Tops',
          bottoms: 'Bottoms',
          dresses: 'Dresses',
          accessories: 'Accessories',
          skirts: 'Skirts'
        },
        stock: {
          instock: 'In Stock',
          lowstock: 'Low Stock',
          preorder: 'Pre-order'
        }
      },
      // Footer
      footer: {
        contactUs: 'Contact Us',
        emailUs: 'Email Us:',
        responseTime: 'WE WILL RESPOND TO YOU IN ENGLISH',
        weekdays: 'within 24hours, from monday to friday.',
        newsletter: 'MORE TO THE BEAT OF OpenME',
        newsletterDesc: 'Never miss out the latest trends and get updates',
        subscribe: 'Subscribe',
        followUs: 'Follow Us',
        service: 'Service',
        contactLink: 'Contact Us',
        customization: 'Customization',
        faq: 'FAQ',
        order: 'Order',
        returnOrder: 'Return Order',
        payment: 'Payment',
        shipping: 'Shipping',
        trackOrder: 'Track Order',
        refund: 'Refund & Exchange',
        aboutUs: 'About Us',
        brandHistory: 'Brand History',
        founder: 'Our Founder',
        manufacturing: 'Manufacturing',
        sizing: 'Sizing',
        influencer: 'Influencer Program',
        social: 'Social Media',
        wholesale: 'Wholesale',
        newsletterBenefits: 'Newsletter Benefits',
        instagram: 'Follow us on Instagram',
        legal: 'Legal',
        terms: 'Term & Conditions',
        privacy: 'Privacy & Cookies',
        copyright: 'All rights reserved'
      }
    }
  }
}

// React import
import { useState } from 'react'

// 语言切换 Hook
export function useLanguage() {
  if (typeof window === 'undefined') {
    return { language: 'en' as Language, setLanguage: () => {}, t: translations.en }
  }

  const [language, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_language')
      return (saved as Language) || 'en'
    }
    return 'en'
  })

  const setLanguage = (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_language', lang)
    }
    setLang(lang)
  }

  return {
    language,
    setLanguage,
    t: translations[language]
  }
}
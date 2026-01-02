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
      step4: '4. 商品激活后会自动显示在前端'
    },

    // 商品上传
    productUpload: {
      title: '上传商品',
      subtitle: '添加新商品到商店',
      backToDashboard: '返回控制台',

      // 基本信息
      basicInfo: '基本信息',
      productName: '商品名称',
      productNamePlaceholder: '例如：霓虹梦幻两件套',
      urlSlug: 'URL 别名',
      urlSlugPlaceholder: '例如：neon-dreams-two-piece',
      urlSlugHint: '可选。如果留空，将自动使用SKU或商品名称生成',
      sku: 'SKU 编号',
      skuPlaceholder: '例如：CFR-NDT-001',
      shortDescription: '简短描述',
      shortDescPlaceholder: '一行简短描述',
      fullDescription: '完整描述',
      fullDescPlaceholder: '详细商品描述...',
      category: '分类',
      selectCategory: '选择分类',

      // 价格和库存
      pricingInventory: '价格与库存',
      price: '价格 (USD)',
      pricePlaceholder: '79.99',
      comparePrice: '对比价格 (USD)',
      comparePricePlaceholder: '99.99',
      inventoryQuantity: '库存数量',
      inventoryPlaceholder: '0',
      trackInventory: '跟踪库存',

      // 图片
      productImages: '商品图片',
      imagePlaceholder: '图片 URL',
      addImageUrl: '添加图片 URL',
      uploadImage: '上传图片',
      addImage: '添加图片',
      clickToUpload: '点击上传图片',
      imageFormat: 'PNG, JPG, GIF 最大5MB',
      uploading: '上传中...',
      imageUploadError: '图片上传失败',
      setPrimary: '设为主图',
      primaryImage: '主图',
      moveUp: '上移',
      moveDown: '下移',
      imageOrder: '图片顺序',

      // 变体
      productVariants: '商品变体',
      enableVariants: '启用变体',
      variantColorPlaceholder: '颜色',
      variantSizePlaceholder: '尺码',
      variantPricePlaceholder: '价格',
      variantInventoryPlaceholder: '库存',
      remove: '移除',
      addVariant: '添加变体',

      // 状态
      status: '状态',
      productStatus: '商品状态',
      draft: '草稿',
      active: '激活',
      archived: '已归档',
      featureProduct: '设为特色商品',

      // 按钮
      createProduct: '创建商品',
      creating: '创建中...',
      cancel: '取消',

      // 提示
      required: '必填'
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
        // 筛选分类
        color: '颜色',
        type: '类型',
        size: '尺码',
        stockStatus: '库存状态',
        // 颜色选项
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
        // 类型选项
        types: {
          sets: '套装',
          tops: '上衣',
          bottoms: '下装',
          dresses: '连衣裙',
          accessories: '配饰',
          skirts: '裙装'
        },
        // 库存状态
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
      step4: '4. Products will automatically appear on the frontend once active'
    },

    // Product upload
    productUpload: {
      title: 'Upload Product',
      subtitle: 'Add a new product to your store',
      backToDashboard: 'Back to Dashboard',

      // Basic info
      basicInfo: 'Basic Information',
      productName: 'Product Name',
      productNamePlaceholder: 'e.g., Neon Dreams Two-Piece',
      urlSlug: 'URL Slug',
      urlSlugPlaceholder: 'e.g., neon-dreams-two-piece',
      urlSlugHint: 'Optional. If left empty, will auto-generate from SKU or product name',
      sku: 'SKU',
      skuPlaceholder: 'e.g., CFR-NDT-001',
      shortDescription: 'Short Description',
      shortDescPlaceholder: 'Brief one-line description',
      fullDescription: 'Full Description',
      fullDescPlaceholder: 'Detailed product description...',
      category: 'Category',
      selectCategory: 'Select a category',

      // Pricing & inventory
      pricingInventory: 'Pricing & Inventory',
      price: 'Price (USD)',
      pricePlaceholder: '79.99',
      comparePrice: 'Compare at Price (USD)',
      comparePricePlaceholder: '99.99',
      inventoryQuantity: 'Inventory Quantity',
      inventoryPlaceholder: '0',
      trackInventory: 'Track inventory',

      // Images
      productImages: 'Product Images',
      imagePlaceholder: 'Image URL',
      addImageUrl: 'Add Image URL',
      uploadImage: 'Upload Image',
      addImage: 'Add Image',
      clickToUpload: 'Click to upload image',
      imageFormat: 'PNG, JPG, GIF up to 5MB',
      uploading: 'Uploading...',
      imageUploadError: 'Image upload failed',
      setPrimary: 'Set as Primary',
      primaryImage: 'Primary Image',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      imageOrder: 'Image Order',

      // Variants
      productVariants: 'Product Variants',
      enableVariants: 'Enable variants',
      variantColorPlaceholder: 'Color',
      variantSizePlaceholder: 'Size',
      variantPricePlaceholder: 'Price',
      variantInventoryPlaceholder: 'Inventory',
      remove: 'Remove',
      addVariant: 'Add Variant',

      // Status
      status: 'Status',
      productStatus: 'Product Status',
      draft: 'Draft',
      active: 'Active',
      archived: 'Archived',
      featureProduct: 'Feature this product',

      // Buttons
      createProduct: 'Create Product',
      creating: 'Creating...',
      cancel: 'Cancel',

      // Hints
      required: 'Required'
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
        // Filter categories
        color: 'Color',
        type: 'Type',
        size: 'Size',
        stockStatus: 'Stock Status',
        // Color options
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
        // Type options
        types: {
          sets: 'Sets',
          tops: 'Tops',
          bottoms: 'Bottoms',
          dresses: 'Dresses',
          accessories: 'Accessories',
          skirts: 'Skirts'
        },
        // Stock status
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

// React import
import { useState } from 'react'

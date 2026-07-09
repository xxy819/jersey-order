// Yupoo 货源链接分类数据
// 结构：大分类 → 细分类 → { primary: 主链接, backups: 备用链接[] }

const SOURCING_DATA = [
  {
    id: 'cat_jerseys',
    labelKey: 'src_jerseys',
    subcategories: [
      {
        id: 'sub_fan_player',
        labelKey: 'src_fan_player',
        primary: { url: 'https://kuangre.x.yupoo.com/', label: '狂热（粉丝版球衣）' },
        backups: [
          { url: 'https://hongpintiyu.x.yupoo.com/', label: '红品体育（球迷版）' },
          { url: 'https://1022669895.x.yupoo.com/albums?tab=gallery', label: 'soccer jersey LIN' },
          { url: 'https://hxltds.x.yupoo.com/', label: '超神（球员版）' },
          { url: 'https://691578215.x.yupoo.com/', label: 'player issue（球员版）' },
        ],
        note: '狂热量最大（938个相册），球迷版+球员版都有',
      },
      {
        id: 'sub_thai',
        labelKey: 'src_thai',
        primary: { url: 'https://lingpao2015.x.yupoo.com/', label: '凌跑 LingPao' },
        backups: [],
        note: '泰版球衣，S-5XL，价格最低，有大码',
      },
      {
        id: 'sub_retro',
        labelKey: 'src_retro',
        primary: { url: 'https://fugu2055.x.yupoo.com/albums', label: '2055B 复古款' },
        backups: [
          { url: 'https://huiliyuan.x.yupoo.com/albums', label: '汇力源复古球衣' },
          { url: 'https://ingsports0828.x.yupoo.com/albums', label: '复古英超西甲意甲' },
        ],
        note: '2055B 年代跨度最大（1973~2020），葡超/西甲最全',
      },
      {
        id: 'sub_cold',
        labelKey: 'src_cold',
        primary: { url: 'https://baiyue123.x.yupoo.com/albums', label: '百越冷门款服饰' },
        backups: [],
        note: '专做冷门小众球队、纪念版、特别版',
      },
      {
        id: 'sub_kids_jersey',
        labelKey: 'src_kids_jersey',
        primary: { url: 'https://fuli8888.x.yupoo.com/', label: 'fuli8888 套装童装' },
        backups: [
          { url: 'https://qyh2944639738qyh.x.yupoo.com/albums', label: '2149 儿童套装' },
          { url: 'https://798a.x.yupoo.com/', label: '798a 复古童装' },
          { url: 'https://1040.x.yupoo.com/categories', label: '2246D 复古冷门童装' },
        ],
        note: 'fuli8888 SKU最大，儿童+成人双线',
      },
      {
        id: 'sub_baby',
        labelKey: 'src_baby',
        primary: { url: 'https://ting8899.x.yupoo.com/albums/93369804', label: 'ting8899 婴儿装' },
        backups: [],
        note: '俱乐部足球婴儿装，9/12码',
      },
      {
        id: 'sub_pants',
        labelKey: 'src_pants',
        primary: { url: 'https://879322886k.x.yupoo.com/', label: '879322886k 球衣配套长裤' },
        backups: [],
        note: '各球队配套短裤/长裤',
      },
      {
        id: 'sub_long_sleeve',
        labelKey: 'src_long_sleeve',
        primary: { url: 'https://8-4hgc8lf.x.yupoo.com/albums?tab=gallery', label: '8-4hgc8lf 长袖球衣' },
        backups: [],
        note: '长袖版球衣，含纪念版/复古休闲版',
      },
    ],
  },
  {
    id: 'cat_training',
    labelKey: 'src_training',
    subcategories: [
      {
        id: 'sub_train_suit',
        labelKey: 'src_train_suit',
        primary: { url: 'https://x.yupoo.com/photos/changjiangsports/albums', label: '长江体育/幻动（训练服）' },
        backups: [
          { url: 'https://ax6789.x.yupoo.com/albums?tab=gallery', label: '志佳训练服（密码2084888）' },
          { url: 'https://aosendi.x.yupoo.com/albums', label: '奥森迪半拉（密码888801）' },
        ],
        note: '长江体育队徽款最全，志佳品类最杂，奥森迪半拉专精',
      },
      {
        id: 'sub_yoga',
        labelKey: 'src_yoga',
        primary: { url: 'https://aodong888.x.yupoo.com/categories/4802218', label: '奥动瑜伽服' },
        backups: [],
        note: '高端瑜伽服套装（Lululemon风格复刻）',
      },
    ],
  },
  {
    id: 'cat_apparel',
    labelKey: 'src_apparel',
    subcategories: [
      {
        id: 'sub_windbreaker',
        labelKey: 'src_windbreaker',
        primary: { url: 'https://1215795243.x.yupoo.com/', label: '百佳风衣' },
        backups: [
          { url: 'https://windbreaker168.x.yupoo.com/', label: '零度防风外套' },
        ],
        note: '足球主题刺绣风衣，有帽/无帽款',
      },
      {
        id: 'sub_hoodie',
        labelKey: 'src_hoodie',
        primary: { url: 'https://ting8899.x.yupoo.com/categories/3729536', label: '博伊德卫衣' },
        backups: [],
        note: '加绒卫衣，65~80元/件',
      },
      {
        id: 'sub_racing',
        labelKey: 'src_racing',
        primary: { url: 'https://yiyisports2016.x.yupoo.com/categories/3551571', label: '邀月赛车服' },
        backups: [
          { url: 'https://minkang.x.yupoo.com/albums', label: '马丁赛车服' },
        ],
        note: 'F1方程式赛车服，S-7XL',
      },
      {
        id: 'sub_brand_tee',
        labelKey: 'src_brand_tee',
        primary: { url: 'https://jie080801jin.x.yupoo.com/categories/4876500', label: '雷霆休闲 LV/GUCCI/BOSS' },
        backups: [],
        note: '17个品牌纯棉T恤，30~55元',
      },
      {
        id: 'sub_nba',
        labelKey: 'src_nba',
        primary: { url: 'http://nbazhxzdy8888.x.yupoo.com/', label: 'NBA服饰' },
        backups: [],
        note: 'NBA全联盟球衣复刻，60~150元',
      },
      {
        id: 'sub_down',
        labelKey: 'src_down',
        primary: { url: 'https://s.wsxc.cn/e5eoWE', label: '强哥（北面/始祖鸟/大鹅）' },
        backups: [
          { url: 'https://heyi3355.x.yupoo.com/categories/5087591', label: 'HeyiSports 棉服' },
        ],
        note: '高端户外复刻（北面、始祖鸟、加拿大鹅、Moncler）',
      },
      {
        id: 'sub_shorts',
        labelKey: 'src_shorts',
        primary: { url: 'https://ty-guoji.x.yupoo.com/categories/4152482', label: '飞人裤子' },
        backups: [],
        note: 'Nike/Adidas/UA等品牌运动短裤复刻',
      },
      {
        id: 'sub_other_apparel',
        labelKey: 'src_other_apparel',
        primary: { url: 'https://hysport.x.yupoo.com/categories', label: '聚亿系列服饰' },
        backups: [],
        note: '足球球衣+棉服，561个相册',
      },
    ],
  },
  {
    id: 'cat_shoes',
    labelKey: 'src_shoes',
    subcategories: [
      {
        id: 'sub_adult_shoes',
        labelKey: 'src_adult_shoes',
        primary: { url: 'https://jsl68.x.yupoo.com/', label: '金双龙 潮牌运动鞋' },
        backups: [],
        note: 'On/Nike/AJ/Adidas/NB/HOKA/LV/Gucci 全品类，36-45码',
      },
      {
        id: 'sub_football_boots',
        labelKey: 'src_football_boots',
        primary: { url: 'https://yongyumeimei.x.yupoo.com/albums?tab=gallery', label: '合一鞋业 足球鞋' },
        backups: [
          { url: 'https://lvguccinike.x.yupoo.com/', label: '力信足球鞋' },
          { url: 'https://lyck.x.yupoo.com/', label: 'lyck 足球鞋' },
        ],
        note: '合一覆盖品牌最广(Nike/Adidas/Puma/Mizuno)，35-46码',
      },
      {
        id: 'sub_kids_shoes',
        labelKey: 'src_kids_shoes',
        primary: { url: 'https://zhaomin1981.x.yupoo.com/', label: '知足者 童鞋' },
        backups: [
          { url: 'https://017017.x.yupoo.com/', label: '017贸易 童鞋' },
        ],
        note: 'Nike/Jordan/Adidas/Puma/On等品牌童鞋复刻，20-37.5码',
      },
    ],
  },
  {
    id: 'cat_accessories',
    labelKey: 'src_accessories',
    subcategories: [
      {
        id: 'sub_football_acc',
        labelKey: 'src_football_acc',
        primary: { url: 'https://huandong123.x.yupoo.com/categories', label: '幻动 足球配件' },
        backups: [
          { url: 'https://meika1.x.yupoo.com/albums/', label: '美卡 体育用品' },
        ],
        note: '足球袜/守门员手套/护腿板/足球/钥匙扣，工厂直营',
      },
      {
        id: 'sub_hat',
        labelKey: 'src_hat',
        primary: { url: 'https://lin881106.x.yupoo.com/albums', label: 'Dora潮帽工厂店（密码881106）' },
        backups: [],
        note: '潮牌帽子',
      },
      {
        id: 'sub_glasses',
        labelKey: 'src_glasses',
        primary: { url: 'https://pengpaipai.x.yupoo.com/', label: 'pengpaipai 眼镜' },
        backups: [],
        note: '雷朋风格太阳镜复刻',
      },
      {
        id: 'sub_electronics',
        labelKey: 'src_electronics',
        primary: { url: 'https://888080.x.yupoo.com/', label: '电子产品（耳机/手表）' },
        backups: [],
        note: 'Beats/Bose/AirPods/Apple Watch高仿复刻',
      },
      {
        id: 'sub_bag',
        labelKey: 'src_bag',
        primary: { url: 'https://pang2017.x.yupoo.com', label: 'pang2017 书包相册' },
        backups: [],
        note: '书包/背包批发',
      },
      {
        id: 'sub_luxury',
        labelKey: 'src_luxury',
        primary: { url: 'https://gz30038.x.yupoo.com/albums', label: '潮流鞋业 奢侈品女鞋' },
        backups: [
          { url: 'https://jie080801jin.x.yupoo.com/categories/4876500', label: '雷霆休闲（LV/GUCCI等T恤，同上）' },
        ],
        note: '女鞋（德训鞋/凉拖/玛丽珍等）',
      },
    ],
  },
]

export default SOURCING_DATA

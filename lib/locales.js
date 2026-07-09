// ============ 四语种翻译数据 ============

const LOCALES = {
  site_title: ['球衣订购', 'Jersey Order', 'Pedido de Camisetas', 'Pedido de Camisetas'],
  site_subtitle: ['球衣及足球周边订购', 'Jerseys & Football Merchandise', 'Camisetas y Artículos de Fútbol', 'Camisetas e Artigos de Futebol'],
  we_accept_paypal: ['支付方式仅支持 PayPal', 'We only accept PayPal', 'Solo aceptamos PayPal', 'Aceitamos apenas PayPal'],

  select_language: ['选择语言', 'Select Language', 'Seleccionar Idioma', 'Selecionar Idioma'],
  lang_zh: ['中文', 'Chinese', 'Chino', 'Chinês'],
  lang_en: ['English', 'English', 'Inglés', 'Inglês'],
  lang_es: ['Español', 'Spanish', 'Español', 'Espanhol'],
  lang_pt: ['Português', 'Portuguese', 'Portugués', 'Português'],

  // ---- 商品分类 ----
  cat_adult: ['成人球衣/套装', 'Adult Jerseys/Sets', 'Camisetas/Conjuntos Adulto', 'Camisetas/Conjuntos Adulto'],
  cat_kids: ['儿童套装类', 'Kids Sets', 'Conjuntos Infantiles', 'Conjuntos Infantis'],
  cat_apparel: ['服装类', 'Apparel', 'Ropa', 'Vestuário'],
  cat_other: ['无标价商品', 'Unpriced Items', 'Sin Precio', 'Sem Preço'],

  // ---- 商品名称 ----
  p_fan_shirt: ['球迷衬衫', 'Fan Shirt', 'Camiseta de Hincha', 'Camisa de Torcedor'],
  p_player: ['球员版本', 'Player Version', 'Versión Jugador', 'Versão Jogador'],
  p_retro_short: ['短袖复古', 'Short Sleeve Retro', 'Retro Manga Corta', 'Retro Manga Curta'],
  p_retro_long: ['长袖复古', 'Long Sleeve Retro', 'Retro Manga Larga', 'Retro Manga Longa'],
  p_adult_set: ['成人短袖套装', 'Adult Short Sleeve Set', 'Set Manga Corta Adulto', 'Kit Manga Curta Adulto'],
  p_kids_set: ['儿童套装', 'Kids Set', 'Set Infantil', 'Kit Infantil'],
  p_retro_kids: ['复古童装', 'Retro Kids', 'Retro Infantil', 'Retro Infantil'],
  p_baby: ['婴儿装', 'Baby', 'Bebé', 'Bebê'],
  p_windbreaker: ['风衣', 'Windbreaker', 'Cortavientos', 'Corta-Vento'],
  p_sweatshirt: ['卫衣', 'Sweatshirt', 'Sudadera', 'Moletom'],
  p_nba: ['NBA', 'NBA', 'NBA', 'NBA'],
  p_racing: ['赛车服', 'Racing Suit', 'Traje de Carreras', 'Macacão de Corrida'],
  p_coat: ['外套', 'Coat', 'Abrigo', 'Casaco'],
  p_half_zip: ['半拉训练服', 'Half-Zip Training', 'Entrenamiento Media Cremallera', 'Treino Meio Zíper'],
  p_full_zip: ['全拉运动服', 'Full-Zip Sportswear', 'Ropa Deportiva Cremallera Completa', 'Agasalho Esportivo Zíper Completo'],
  p_hooded_sport: ['连帽运动服', 'Hooded Sportswear', 'Ropa Deportiva con Capucha', 'Agasalho Esportivo com Capuz'],
  p_down_jacket: ['全套羽绒服', 'Full Down Jacket', 'Chaqueta de Plumas', 'Jaqueta de Penas Completa'],
  p_other: ['无标价商品', 'Unpriced Item', 'Sin Precio', 'Sem Preço'],

  // ---- 附加选项 ----
  addon_patch: ['补丁', 'Patch', 'Parche', 'Remendo'],
  addon_patch_upload: ['上传补丁图片', 'Upload patch image', 'Subir imagen del parche', 'Enviar imagem do remendo'],
  addon_socks: ['加袜子', 'Add Socks', 'Añadir Calcetines', 'Adicionar Meias'],
  addon_hood: ['带帽子', 'With Hood', 'Con Capucha', 'Com Capuz'],

  // ---- 运费 ----
  shipping: ['运费', 'Shipping', 'Envío', 'Frete'],
  shipping_free: ['免运费', 'Free Shipping', 'Envío Gratis', 'Frete Grátis'],
  shipping_fee: ['{n} 件以下运费 {fee}€', 'Shipping {fee}€ (under {n} items)', 'Envío {fee}€ (menos de {n} artículos)', 'Frete {fee}€ (menos de {n} itens)'],
  shipping_threshold: ['满 {n} 件免运费', 'Free shipping for {n}+ items', 'Envío gratis desde {n} artículos', 'Frete grátis a partir de {n} itens'],

  // ---- 下单页面 ----
  add_product: ['添加商品', 'Add Product', 'Añadir Producto', 'Adicionar Produto'],
  product_image: ['商品图片 *', 'Product Image *', 'Imagen del Producto *', 'Imagem do Produto *'],
  click_to_upload: ['点击上传图片', 'Click to upload', 'Haga clic para subir', 'Clique para enviar'],
  product_name: ['商品名称', 'Product Name', 'Nombre del Producto', 'Nome do Produto'],
  product_name_placeholder: ['例: 2024-25 主场球衣', 'e.g. 2024-25 Home Kit', 'Ej: 2024-25 Local', 'Ex: 2024-25 Camisa Casa'],
  select_product: ['选择商品 *', 'Select Product *', 'Seleccionar Producto *', 'Selecionar Produto *'],
  size: ['尺码 *', 'Size *', 'Talla *', 'Tamanho *'],
  select_placeholder: ['-- 请选择 --', '-- Select --', '-- Seleccionar --', '-- Selecionar --'],
  quantity: ['数量', 'Quantity', 'Cantidad', 'Quantidade'],
  custom_service: ['定制印字（名字 + 号码）', 'Custom Print (Name + Number)', 'Impresión Personalizada (Nombre + Número)', 'Impressão Personalizada (Nome + Número)'],
  custom_name: ['名字', 'Name', 'Nombre', 'Nome'],
  custom_number: ['号码', 'Number', 'Número', 'Número'],
  custom_name_placeholder: ['MESSI', 'MESSI', 'MESSI', 'MESSI'],
  addon_title: ['附加选项', 'Add-ons', 'Extras', 'Extras'],
  add_to_cart: ['加入清单', 'Add to Cart', 'Añadir al Carrito', 'Adicionar ao Carrinho'],

  cart_title: ['购物清单', 'Shopping Cart', 'Carrito de Compras', 'Carrinho de Compras'],
  cart_empty: ['暂无商品，请添加', 'Cart is empty', 'El carrito está vacío', 'O carrinho está vazio'],
  subtotal: ['小计', 'Subtotal', 'Subtotal', 'Subtotal'],
  unit_price: ['单价', 'Unit Price', 'Precio Unitario', 'Preço Unitário'],

  customer_info: ['客户信息', 'Customer Info', 'Información del Cliente', 'Informações do Cliente'],
  // ---- 客户信息 ----
  name: ['姓名 *', 'Name *', 'Nombre *', 'Nome *'],
  email: ['邮箱 *', 'Email *', 'Correo *', 'Email *'],
  phone: ['电话', 'Phone', 'Teléfono', 'Telefone'],
  country: ['国家 *', 'Country *', 'País *', 'País *'],
  region: ['地区/省份 *', 'Region/State *', 'Región/Provincia *', 'Região/Estado *'],
  city: ['城市 *', 'City *', 'Ciudad *', 'Cidade *'],
  street: ['街道地址 *', 'Street Address *', 'Dirección *', 'Endereço *'],
  street_placeholder: ['街道、门牌号', 'Street, Number', 'Calle, Número', 'Rua, Número'],
  postal_code: ['邮政编码 *', 'Postal Code *', 'Código Postal *', 'Código Postal *'],
  note: ['备注', 'Note', 'Nota', 'Observação'],
  note_placeholder: ['其他需求', 'Other requests', 'Otros requisitos', 'Outros pedidos'],
  order_total: ['商品总价', 'Items Total', 'Total Productos', 'Total Produtos'],
  grand_total: ['应付总额', 'Grand Total', 'Total General', 'Total Geral'],
  submit_order: ['提交订单', 'Submit Order', 'Enviar Pedido', 'Enviar Pedido'],
  submitting: ['提交中...', 'Submitting...', 'Enviando...', 'Enviando...'],

  order_success: ['订单提交成功！', 'Order Submitted!', '¡Pedido Enviado!', 'Pedido Enviado!'],
  thanks_message: ['感谢您的订购，我们会尽快处理', 'Thank you for your order. We will process it soon.', 'Gracias por su pedido. Lo procesaremos pronto.', 'Obrigado pelo seu pedido. Processaremos em breve.'],
  order_id: ['订单编号', 'Order ID', 'ID del Pedido', 'ID do Pedido'],
  copy: ['复制', 'Copy', 'Copiar', 'Copiar'],
  payment_amount: ['付款金额', 'Payment Amount', 'Monto del Pago', 'Valor do Pagamento'],
  paypal_instruction: ['请通过 PayPal 付款至', 'Please send payment via PayPal to', 'Envíe el pago por PayPal a', 'Envie o pagamento por PayPal para'],
  paypal_note: ['请使用贝宝的朋友付款，为了避免贝宝的高额费用，并确保你的产品顺利通过海关并正确送达家中，只能使用朋友身份支付的选项。',
    'Please use PayPal Friends and Family to avoid high fees, ensure smooth customs clearance, and correct delivery to your home. Only the Friends and Family option is accepted.',
    'Utilice PayPal Amigos y Familia para evitar comisiones elevadas, garantizar un despacho de aduanas fluido y la entrega correcta en su domicilio. Solo se acepta la opción Amigos y Familia.',
    'Use PayPal Amigos e Família para evitar taxas elevadas, garantir o desembaraço aduaneiro tranquilo e a entrega correta em sua casa. Apenas a opção Amigos e Família é aceita.'],
  continue_ordering: ['继续下单', 'Continue Ordering', 'Seguir Comprando', 'Continuar Comprando'],
  upload_payment_proof: ['上传付款截图', 'Upload Payment Proof', 'Subir Comprobante de Pago', 'Enviar Comprovante de Pagamento'],
  upload_payment_hint: ['付款成功后，请在此上传截图以便我们确认', 'After payment, please upload a screenshot for confirmation', 'Después del pago, suba una captura de pantalla para confirmar', 'Após o pagamento, envie um comprovante para confirmação'],
  payment_uploaded: ['已上传，等待确认', 'Uploaded, awaiting confirmation', 'Subido, esperando confirmación', 'Enviado, aguardando confirmação'],
  upload_success: ['截图上传成功', 'Screenshot uploaded', 'Captura subida', 'Comprovante enviado'],

  // ---- 错误提示 ----
  error_select_product: ['请选择商品', 'Please select a product', 'Seleccione un producto', 'Selecione um produto'],
  error_select_size: ['请选择尺码', 'Please select a size', 'Seleccione una talla', 'Selecione um tamanho'],
  error_upload_image: ['请上传商品图片', 'Please upload an image', 'Suba una imagen', 'Envie uma imagem'],
  error_image_size: ['图片不能超过 5MB', 'Image must be under 5MB', 'La imagen no debe superar los 5MB', 'A imagem não pode exceder 5MB'],
  error_cart_empty: ['购物车为空，请添加商品', 'Cart is empty, please add items', 'El carrito está vacío, añada productos', 'O carrinho está vazio, adicione itens'],
  error_name_required: ['请填写姓名', 'Please enter your name', 'Ingrese su nombre', 'Insira seu nome'],
  error_email_invalid: ['请填写有效邮箱', 'Please enter a valid email', 'Ingrese un correo válido', 'Insira um email válido'],
  error_country_required: ['请填写国家', 'Please enter your country', 'Ingrese su país', 'Insira seu país'],
  error_city_required: ['请填写城市', 'Please enter your city', 'Ingrese su ciudad', 'Insira sua cidade'],
  error_street_required: ['请填写街道地址', 'Please enter your street address', 'Ingrese su dirección', 'Insira seu endereço'],
  error_postal_required: ['请填写邮政编码', 'Please enter your postal code', 'Ingrese su código postal', 'Insira seu código postal'],
  error_network: ['网络错误，请检查连接后重试', 'Network error, please try again', 'Error de red, intente de nuevo', 'Erro de rede, tente novamente'],
  error_submit: ['提交失败，请重试', 'Submit failed, please try again', 'Error al enviar, intente de nuevo', 'Falha ao enviar, tente novamento'],

  // ---- 尺码指南 ----
  size_guide: ['尺码指南', 'Size Guide', 'Guía de Tallas', 'Guia de Tamanhos'],
  size_chart_men: ['男士尺码表', 'Men Size Chart', 'Tabla de Tallas Hombre', 'Tabela de Tamanhos Masculino'],
  size_chart_women: ['女士尺码表', 'Women Size Chart', 'Tabla de Tallas Mujer', 'Tabela de Tamanhos Feminino'],
  size_chart_kids: ['儿童尺码表', 'Kids Size Chart', 'Tabla de Tallas Infantil', 'Tabela de Tamanhos Infantil'],
  size_chart_baby: ['婴儿尺码表', 'Baby Size Chart', 'Tabla de Tallas Bebé', 'Tabela de Tamanhos Bebê'],
  size_col: ['尺码', 'Size', 'Talla', 'Tamanho'],
  length_col: ['衣长(cm)', 'Length(cm)', 'Largo(cm)', 'Comprimento(cm)'],
  width_col: ['宽度(cm)', 'Width(cm)', 'Ancho(cm)', 'Largura(cm)'],
  height_col: ['身高(cm)', 'Height(cm)', 'Altura(cm)', 'Altura(cm)'],
  weight_col: ['体重(kg)', 'Weight(kg)', 'Peso(kg)', 'Peso(kg)'],
  age_col: ['年龄', 'Age', 'Edad', 'Idade'],
  waist_col: ['裤腰(cm)', 'Waist(cm)', 'Cintura(cm)', 'Cintura(cm)'],
  close: ['关闭', 'Close', 'Cerrar', 'Fechar'],

  // ---- 货源图片参考 ----
  src_jerseys: ['球衣', 'Jerseys', 'Camisetas', 'Camisetas'],
  src_training: ['训练服/运动套装', 'Training Wear', 'Ropa de Entrenamiento', 'Roupas de Treino'],
  src_apparel: ['服装', 'Apparel', 'Ropa', 'Vestuário'],
  src_shoes: ['鞋', 'Shoes', 'Zapatos', 'Calçados'],
  src_accessories: ['配件/其他', 'Accessories', 'Accesorios', 'Acessórios'],

  src_fan_player: ['球迷版/球员版', 'Fan/Player Version', 'Versión Hincha/Jugador', 'Versão Torcedor/Jogador'],
  src_thai: ['泰版球衣', 'Thai Version', 'Versión Tailandesa', 'Versão Tailandesa'],
  src_retro: ['复古球衣', 'Retro Jerseys', 'Camisetas Retro', 'Camisetas Retro'],
  src_cold: ['冷门款球衣', 'Rare/Niche Jerseys', 'Camisetas Raras', 'Camisetas Raras'],
  src_kids_jersey: ['儿童球衣', 'Kids Jerseys', 'Camisetas Infantiles', 'Camisetas Infantis'],
  src_baby: ['婴儿装', 'Baby Wear', 'Ropa de Bebé', 'Roupas de Bebê'],
  src_pants: ['球衣配套长裤', 'Match Pants', 'Pantalones Deportivos', 'Calções Esportivos'],
  src_long_sleeve: ['长袖球衣', 'Long Sleeve Jerseys', 'Camisetas Manga Larga', 'Camisetas Manga Longa'],

  src_train_suit: ['训练服套装', 'Training Suits', 'Conjuntos de Entrenamiento', 'Conjuntos de Treino'],
  src_yoga: ['瑜伽服', 'Yoga Wear', 'Ropa de Yoga', 'Roupas de Yoga'],

  src_windbreaker: ['风衣/外套', 'Windbreakers', 'Cortavientos', 'Corta-Ventos'],
  src_hoodie: ['卫衣', 'Hoodies', 'Sudadera', 'Moletons'],
  src_racing: ['赛车服', 'Racing Suits', 'Trajes de Carreras', 'Macacões de Corrida'],
  src_brand_tee: ['品牌T恤/Polo', 'Brand Tees/Polo', 'Camisetas de Marca', 'Camisetas de Marca'],
  src_nba: ['NBA球衣', 'NBA Jerseys', 'Camisetas NBA', 'Camisetas NBA'],
  src_down: ['棉服/羽绒服', 'Down Jackets', 'Chaquetas de Plumas', 'Jaquetas de Penas'],
  src_shorts: ['运动短裤', 'Sports Shorts', 'Pantalones Cortos', 'Shorts Esportivos'],
  src_other_apparel: ['其他服饰', 'Other Apparel', 'Otra Ropa', 'Outras Roupas'],

  src_adult_shoes: ['成人运动鞋', 'Adult Sports Shoes', 'Zapatos Deportivos', 'Tênis Esportivos'],
  src_football_boots: ['足球鞋', 'Football Boots', 'Botas de Fútbol', 'Chuteiras'],
  src_kids_shoes: ['童鞋', 'Kids Shoes', 'Zapatos Infantiles', 'Sapatos Infantis'],

  src_football_acc: ['足球配件', 'Football Acc.', 'Acc. de Fútbol', 'Acess. de Futebol'],
  src_hat: ['帽子', 'Hats', 'Gorras', 'Bonés'],
  src_glasses: ['眼镜', 'Glasses', 'Gafas', 'Óculos'],
  src_electronics: ['电子产品', 'Electronics', 'Electrónicos', 'Eletrônicos'],
  src_bag: ['书包/背包', 'Bags', 'Mochilas', 'Mochilas'],
  src_luxury: ['奢侈品鞋服', 'Luxury Wear', 'Ropa/Lujo', 'Roupas/Luxo'],

  src_tip: ['📷 拿不准选什么？点击查看商品图片', '📷 Not sure? Browse product images', '📷 ¿No sabes qué elegir? Ver imágenes', '📷 Não sabe o que escolher? Veja imagens'],
  src_visit: ['查看图片 →', 'View Images →', 'Ver Imágenes →', 'Ver Imagens →'],
  src_select_category: ['点击上方分类查看商品图片', 'Select a category above', 'Selecciona una categoría', 'Selecione uma categoria'],

  // ---- 订单状态 ----
  status_pending: ['待付款', 'Pending', 'Pendiente', 'Pendente'],
  status_paid: ['已付款', 'Paid', 'Pagado', 'Pago'],
  status_shipped: ['已发货', 'Shipped', 'Enviado', 'Enviado'],

  // ---- 后台管理 ----
  admin_title: ['订单管理', 'Order Management', 'Gestión de Pedidos', 'Gestão de Pedidos'],
  admin_login: ['后台管理', 'Admin Login', 'Inicio de Sesión', 'Login Administrativo'],
  admin_password: ['请输入管理密码', 'Enter admin password', 'Ingrese la contraseña', 'Insira a senha'],
  admin_login_btn: ['登录', 'Login', 'Iniciar Sesión', 'Entrar'],
  admin_logout: ['退出', 'Logout', 'Cerrar Sesión', 'Sair'],
  admin_search: ['搜索客户...', 'Search customer...', 'Buscar cliente...', 'Buscar cliente...'],
  admin_search_btn: ['搜索', 'Search', 'Buscar', 'Buscar'],
  admin_export_csv: ['导出 CSV', 'Export CSV', 'Exportar CSV', 'Exportar CSV'],
  admin_total_orders: ['共 {n} 条订单', '{n} orders total', '{n} pedidos en total', '{n} pedidos no total'],
  admin_loading: ['加载中...', 'Loading...', 'Cargando...', 'Carregando...'],
  admin_no_orders: ['暂无订单', 'No orders', 'Sin pedidos', 'Nenhum pedido'],
  admin_items_count: ['{n} 件商品', '{n} items', '{n} artículos', '{n} itens'],
  admin_order_detail: ['商品明细', 'Order Details', 'Detalles del Pedido', 'Detalhes do Pedido'],
  admin_wrong_password: ['密码错误', 'Wrong password', 'Contraseña incorrecta', 'Senha incorreta'],
  admin_shipping: ['运费', 'Shipping', 'Envío', 'Frete'],
  admin_grand_total: ['总应付', 'Grand Total', 'Total General', 'Total Geral'],
  admin_time: ['时间', 'Time', 'Hora', 'Hora'],
  admin_status: ['状态', 'Status', 'Estado', 'Estado'],
  admin_subtotal: ['商品小计', 'Items Subtotal', 'Subtotal Productos', 'Subtotal Produtos'],

  label_country: ['国家：', 'Country: ', 'País: ', 'País: '],
  label_region: ['地区：', 'Region: ', 'Región: ', 'Região: '],
  label_city: ['城市：', 'City: ', 'Ciudad: ', 'Cidade: '],
  label_street: ['地址：', 'Address: ', 'Dirección: ', 'Endereço: '],
  label_postal: ['邮编：', 'Postal Code: ', 'Código Postal: ', 'Código Postal: '],
  label_phone: ['电话：', 'Phone: ', 'Teléfono: ', 'Telefone: '],
  label_note: ['备注：', 'Note: ', 'Nota: ', 'Observação: '],
  custom_info: ['定制：{name} #{number}', 'Custom: {name} #{number}', 'Personalizado: {name} #{number}', 'Personalizado: {name} #{number}'],
  addons_label: ['附加：', 'Add-ons: ', 'Extras: ', 'Extras: '],
  patch_image_label: ['补丁图片：', 'Patch Image: ', 'Imagen del Parche: ', 'Imagem do Remendo: '],
  shipping_label: ['运费：', 'Shipping: ', 'Envío: ', 'Frete: '],
}

export const LANG_CODES = ['zh', 'en', 'es', 'pt']
export const LANG_NAMES = ['中文', 'English', 'Español', 'Português']

export function getText(key, langIndex, params = {}) {
  const texts = LOCALES[key]
  if (!texts) return key
  let text = texts[langIndex] || texts[0]
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(`{${k}}`, v)
  }
  return text
}

export function getStyleLabel(styleId, langIndex) {
  // 兼容旧代码：现在直接返回商品名称翻译
  const keyMap = {
    player: 'p_player', fan_shirt: 'p_fan_shirt', retro_short: 'p_retro_short',
    retro_long: 'p_retro_long', adult_set: 'p_adult_set', kids_set: 'p_kids_set',
    retro_kids: 'p_retro_kids', baby: 'p_baby', windbreaker: 'p_windbreaker',
    sweatshirt: 'p_sweatshirt', nba: 'p_nba', racing: 'p_racing',
    coat: 'p_coat', half_zip: 'p_half_zip', full_zip: 'p_full_zip',
    hooded_sport: 'p_hooded_sport', down_jacket: 'p_down_jacket',
    other: 'p_other',
  }
  const key = keyMap[styleId]
  return key ? getText(key, langIndex) : styleId
}

export default LOCALES

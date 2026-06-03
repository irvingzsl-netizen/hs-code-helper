// 初始数据 - 完整200+条数据
const initialData = [
    {"类别":"塑料制品","中英品名":"普通塑料日用品 / plastic general articles","材质/用途判断":"塑料；无明确餐厨/包装/文具用途","HS6":"3926.90","10位申报":"3926.90.99.90","B3 Duty / MFN":"6.5%","口径":"普通塑料杂项制品"},
    {"类别":"塑料制品","中英品名":"塑料办公学校用品 / plastic office or school supplies","材质/用途判断":"文件夹、卡册、文具盒、办公塑料件","HS6":"3926.10","10位申报":"3926.10.00.90","B3 Duty / MFN":"6.5%","口径":"办公/学校用途优先"},
    {"类别":"塑料制品","中英品名":"塑料装饰摆件 / plastic ornaments","材质/用途判断":"塑料装饰品、摆件、挂饰","HS6":"3926.40","10位申报":"3926.40.90.00","B3 Duty / MFN":"6.5%","口径":"装饰陈列用"},
    {"类别":"塑料制品","中英品名":"塑料家具/车体类配件 / plastic fittings","材质/用途判断":"塑料家具配件、车体小配件","HS6":"3926.30","10位申报":"3926.30.00.00","B3 Duty / MFN":"Free","口径":"按配件用途"},
    {"类别":"塑料制品","中英品名":"塑料餐具厨房用品 / plastic tableware kitchenware","材质/用途判断":"塑料杯、盘、碗、厨房小工具","HS6":"3924.10","10位申报":"3924.10.00.00","B3 Duty / MFN":"6.5%","口径":"餐厨用途"},
    {"类别":"塑料制品","中英品名":"塑料家庭/卫生用品 / plastic household sanitary articles","材质/用途判断":"浴室、清洁、家居卫生塑料用品","HS6":"3924.90","10位申报":"3924.90.00.00","B3 Duty / MFN":"6.5%","口径":"家用非餐厨"},
    {"类别":"塑料制品","中英品名":"塑料箱盒周转箱 / plastic boxes cases crates","材质/用途判断":"塑料包装箱、收纳箱、周转箱","HS6":"3923.10","10位申报":"3923.10.00.00","B3 Duty / MFN":"Free","口径":"包装/运输容器"},
    {"类别":"塑料制品","中英品名":"PE塑料袋 / PE plastic sacks bags","材质/用途判断":"乙烯聚合物包装袋、购物袋","HS6":"3923.21","10位申报":"3923.21.90.90","B3 Duty / MFN":"6.5%","口径":"PE袋类"},
    {"类别":"塑料制品","中英品名":"其他塑料袋 / other plastic sacks bags","材质/用途判断":"非PE或材质不明塑料包装袋","HS6":"3923.29","10位申报":"3923.29.90.00","B3 Duty / MFN":"6.5%","口径":"其他塑料袋"},
    {"类别":"塑料制品","中英品名":"塑料瓶 / plastic bottles flasks","材质/用途判断":"塑料瓶、罐、类似容器","HS6":"3923.30","10位申报":"3923.30.90.90","B3 Duty / MFN":"6.5%","口径":"包装容器"},
    {"类别":"塑料制品","中英品名":"塑料盖/瓶盖 / plastic lids caps closures","材质/用途判断":"瓶盖、杯盖、封口件","HS6":"3923.50","10位申报":"3923.50.90.90","B3 Duty / MFN":"6.5%","口径":"包装封口件"},
    {"类别":"塑料制品","中英品名":"其他塑料包装件 / other plastic packing articles","材质/用途判断":"泡壳、内托、包装配件","HS6":"3923.90","10位申报":"3923.90.90.90","B3 Duty / MFN":"6.5%","口径":"包装专用"},
    {"类别":"塑料制品","中英品名":"塑料胶带≤20cm / self-adhesive plastic tape","材质/用途判断":"卷状自粘胶带，宽度≤20cm","HS6":"3919.10","10位申报":"3919.10.99.90","B3 Duty / MFN":"6.5%","口径":"自粘塑料带"},
    {"类别":"塑料制品","中英品名":"自粘塑料膜片 / self-adhesive plastic film sheet","材质/用途判断":"自粘贴膜、贴纸、保护膜","HS6":"3919.90","10位申报":"3919.90.00.90","B3 Duty / MFN":"Free","口径":"非窄卷自粘"},
    {"类别":"塑料制品","中英品名":"PE塑料膜片 / polyethylene film sheet","材质/用途判断":"非自粘PE膜、片、板","HS6":"3920.10","10位申报":"3920.10.00.90","B3 Duty / MFN":"Free","口径":"按塑料种类"},
    {"类别":"塑料制品","中英品名":"PP塑料膜片 / polypropylene film sheet","材质/用途判断":"非自粘PP膜、片、板","HS6":"3920.20","10位申报":"3920.20.00.90","B3 Duty / MFN":"Free","口径":"按塑料种类"},
    {"类别":"塑料制品","中英品名":"塑料卫生洁具 / plastic sanitary ware","材质/用途判断":"盆、桶、浴室卫生类塑料制品","HS6":"3922.90","10位申报":"3922.90.00.00","B3 Duty / MFN":"6.5%","口径":"卫生洁具"},
    {"类别":"塑料制品","中英品名":"塑料服装附件 / plastic apparel accessories","材质/用途判断":"塑料雨衣、塑料手套、腰带等","HS6":"3926.20","10位申报":"3926.20.99.90","B3 Duty / MFN":"6.5%","口径":"穿戴附件"},
    {"类别":"橡胶制品","中英品名":"橡胶杂项制品 / rubber articles","材质/用途判断":"硫化橡胶小件、防震件、防滑件","HS6":"4016.99","10位申报":"4016.99.90.90","B3 Duty / MFN":"6.5%","口径":"普通橡胶杂项"},
    {"类别":"橡胶制品","中英品名":"橡胶垫/地垫 / rubber mats","材质/用途判断":"橡胶地垫、防滑垫","HS6":"4016.91","10位申报":"4016.91.00.00","B3 Duty / MFN":"7%","口径":"地面覆盖/垫"},
    {"类别":"橡胶制品","中英品名":"橡胶手套 / rubber gloves","材质/用途判断":"清洁、防护、家务橡胶手套","HS6":"4015.19","10位申报":"4015.19.90.00","B3 Duty / MFN":"15.5%","口径":"非医疗普通手套"},
    {"类别":"橡胶制品","中英品名":"橡胶水管带接头 / rubber hose with fittings","材质/用途判断":"花园水管、橡胶软管带附件","HS6":"4009.42","10位申报":"4009.42.00.00","B3 Duty / MFN":"Free","口径":"带接头软管"},
    {"类别":"纸制品","中英品名":"A4打印纸 / A4 copy paper","材质/用途判断":"未涂布书写/打印纸，A4常见规格","HS6":"4802.56","10位申报":"4802.56.00.90","B3 Duty / MFN":"Free","口径":"书写印刷用纸"},
    {"类别":"纸制品","中英品名":"普通书写印刷纸 / writing printing paper","材质/用途判断":"未涂布纸，非A4固定规格","HS6":"4802.57","10位申报":"4802.57.00.00","B3 Duty / MFN":"Free","口径":"按规格克重"},
    {"类别":"纸制品","中英品名":"自粘纸/标签纸 / self-adhesive paper","材质/用途判断":"纸基自粘材料、标签纸卷","HS6":"4811.41","10位申报":"4811.41.00.90","B3 Duty / MFN":"Free","口径":"纸基自粘"},
    {"类别":"纸制品","中英品名":"信封 / envelopes","材质/用途判断":"纸信封、邮寄信封","HS6":"4817.10","10位申报":"4817.10.00.00","B3 Duty / MFN":"Free","口径":"信封"},
    {"类别":"纸制品","中英品名":"明信片/信卡 / letter cards postcards","材质/用途判断":"普通通信卡片，非祝福卡","HS6":"4817.20","10位申报":"4817.20.00.00","B3 Duty / MFN":"Free","口径":"通信纸卡"},
    {"类别":"纸制品","中英品名":"瓦楞纸箱 / corrugated cartons boxes","材质/用途判断":"瓦楞纸箱、瓦楞盒","HS6":"4819.10","10位申报":"4819.10.00.00","B3 Duty / MFN":"Free","口径":"瓦楞包装"},
    {"类别":"纸制品","中英品名":"折叠纸盒 / folding paper cartons","材质/用途判断":"非瓦楞折叠纸盒、彩盒","HS6":"4819.20","10位申报":"4819.20.00.00","B3 Duty / MFN":"Free","口径":"非瓦楞包装盒"},
    {"类别":"纸制品","中英品名":"纸袋 / paper bags sacks","材质/用途判断":"纸购物袋、包装纸袋","HS6":"4819.40","10位申报":"4819.40.00.00","B3 Duty / MFN":"Free","口径":"纸袋包装"},
    {"类别":"纸制品","中英品名":"其他纸包装容器 / other paper packing containers","材质/用途判断":"礼品盒、硬纸盒、包装容器","HS6":"4819.50","10位申报":"4819.50.00.00","B3 Duty / MFN":"Free","口径":"其他纸包装"},
    {"类别":"纸制品","中英品名":"办公室纸质收纳盒 / paper office storage box","材质/用途判断":"文件盒、信盘、档案盒","HS6":"4819.60","10位申报":"4819.60.00.00","B3 Duty / MFN":"Free","口径":"办公收纳纸品"},
    {"类别":"文具","中英品名":"笔记本/记事本 / notebook diary memo pad","材质/用途判断":"本册、账册、便签本、日记本","HS6":"4820.10","10位申报":"4820.10.00.00","B3 Duty / MFN":"Free","口径":"纸制本册"},
    {"类别":"文具","中英品名":"练习本 / exercise books","材质/用途判断":"学生练习本、作业本","HS6":"4820.20","10位申报":"4820.20.00.00","B3 Duty / MFN":"Free","口径":"练习本"},
    {"类别":"文具","中英品名":"纸质文件夹/活页夹 / binders folders","材质/用途判断":"文件夹、档案夹、夹套","HS6":"4820.30","10位申报":"4820.30.00.90","B3 Duty / MFN":"Free","口径":"纸质归档用品"},
    {"类别":"文具","中英品名":"相册/样本册 / albums","材质/用途判断":"相册、样本册、收藏册","HS6":"4820.50","10位申报":"4820.50.00.00","B3 Duty / MFN":"Free","口径":"册类"},
    {"类别":"文具","中英品名":"印刷纸标签 / printed paper labels","材质/用途判断":"印刷纸标签、吊牌","HS6":"4821.10","10位申报":"4821.10.00.00","B3 Duty / MFN":"Free","口径":"标签"},
    {"类别":"文具","中英品名":"未印刷纸标签 / paper labels not printed","材质/用途判断":"空白标签、纸吊牌","HS6":"4821.90","10位申报":"4821.90.00.00","B3 Duty / MFN":"Free","口径":"标签"},
    {"类别":"印刷品","中英品名":"贺卡/祝福卡 / greeting cards","材质/用途判断":"节日卡、生日卡、祝福卡","HS6":"4909.00","10位申报":"4909.00.00.00","B3 Duty / MFN":"Free","口径":"印刷祝福卡"},
    {"类别":"印刷品","中英品名":"说明书/小册子 / manuals leaflets brochures","材质/用途判断":"印刷说明书、宣传册、小册子","HS6":"4901.99","10位申报":"4901.99.00.90","B3 Duty / MFN":"Free","口径":"印刷书册"},
    {"类别":"印刷品","中英品名":"商业目录/广告品 / catalogues advertising material","材质/用途判断":"产品目录、广告单、宣传资料","HS6":"4911.10","10位申报":"4911.10.00.90","B3 Duty / MFN":"Free","口径":"商业印刷品"},
    {"类别":"印刷品","中英品名":"海报/图片/照片 / posters pictures photos","材质/用途判断":"海报、印刷图片、照片","HS6":"4911.91","10位申报":"4911.91.00.20","B3 Duty / MFN":"Free","口径":"图片类印刷品"},
    {"类别":"印刷品","中英品名":"其他印刷品 / other printed matter","材质/用途判断":"贴纸图案、印刷片、其他印刷物","HS6":"4911.99","10位申报":"4911.99.00.90","B3 Duty / MFN":"Free","口径":"未列名印刷品"},
    {"类别":"文具","中英品名":"圆珠笔/记号笔 / ball pens markers","材质/用途判断":"笔类书写工具","HS6":"9608.10","10位申报":"9608.10.00.00","B3 Duty / MFN":"7%","口径":"笔类"},
    {"类别":"文具","中英品名":"铅笔/蜡笔 / pencils crayons","材质/用途判断":"铅笔、彩铅、蜡笔","HS6":"9609.10","10位申报":"9609.10.00.00","B3 Duty / MFN":"7%","口径":"铅笔类"},
    {"类别":"文具","中英品名":"白板/黑板 / slates boards","材质/用途判断":"白板、黑板、书写板","HS6":"9610.00","10位申报":"9610.00.00.00","B3 Duty / MFN":"4.5%","口径":"书写展示板"},
    {"类别":"纺织制品","中英品名":"其他纺织制成品 / other made-up textile articles","材质/用途判断":"布制小件、收纳、罩套、未列名纺织品","HS6":"6307.90","10位申报":"6307.90.99.00","B3 Duty / MFN":"18%","口径":"纺织杂项"},
    {"类别":"纺织制品","中英品名":"床上/桌上/厨房布草-棉 / cotton bed table kitchen linen","材质/用途判断":"床单、桌布、厨房布草；棉","HS6":"6302.31","10位申报":"6302.31.00.00","B3 Duty / MFN":"17%","口径":"布草按纤维"},
    {"类别":"纺织制品","中英品名":"床上/桌上/厨房布草-化纤 / man-made fibre linen","材质/用途判断":"床单、桌布、厨房布草；化纤","HS6":"6302.32","10位申报":"6302.32.00.00","B3 Duty / MFN":"18%","口径":"布草按纤维"},
    {"类别":"纺织制品","中英品名":"毯子-合成纤维 / synthetic blankets","材质/用途判断":"涤纶/化纤毯、旅行毯","HS6":"6301.40","10位申报":"6301.40.00.00","B3 Duty / MFN":"17%","口径":"毯子按纤维"},
    {"类别":"纺织制品","中英品名":"窗帘-棉 / cotton curtains","材质/用途判断":"棉制窗帘、帘布","HS6":"6303.91","10位申报":"6303.91.00.00","B3 Duty / MFN":"17%","口径":"窗帘按纤维"},
    {"类别":"纺织制品","中英品名":"窗帘-合成纤维 / synthetic curtains","材质/用途判断":"涤纶窗帘、帘布","HS6":"6303.92","10位申报":"6303.92.90.90","B3 Duty / MFN":"18%","口径":"窗帘按纤维"},
    {"类别":"纺织制品","中英品名":"家居软装-棉 / cotton furnishing articles","材质/用途判断":"抱枕套、桌旗、布装饰；棉","HS6":"6304.92","10位申报":"6304.92.90.00","B3 Duty / MFN":"17%","口径":"非床品软装"},
    {"类别":"纺织制品","中英品名":"家居软装-合成纤维 / synthetic furnishing articles","材质/用途判断":"抱枕套、罩布、布装饰；化纤","HS6":"6304.93","10位申报":"6304.93.90.00","B3 Duty / MFN":"18%","口径":"非床品软装"},
    {"类别":"纺织制品","中英品名":"纺织包装袋-PP/PE条带 / textile packing sacks","材质/用途判断":"编织袋、包装袋；PP/PE条带","HS6":"6305.33","10位申报":"6305.33.00.90","B3 Duty / MFN":"18%","口径":"装货包装袋"},
    {"类别":"纺织制品","中英品名":"帐篷 / tents synthetic","材质/用途判断":"合成纤维帐篷","HS6":"6306.22","10位申报":"6306.22.00.90","B3 Duty / MFN":"18%","口径":"户外露营"},
    {"类别":"纺织制品","中英品名":"绳索-合成纤维 / synthetic cord rope","材质/用途判断":"涤纶/尼龙绳、编绳","HS6":"5607.50","10位申报":"5607.50.90.00","B3 Duty / MFN":"10%","口径":"按绳索材质"},
    {"类别":"纺织制品","中英品名":"网 / made-up nets","材质/用途判断":"货网、花园网、运动网；绳线制","HS6":"5608.19","10位申报":"5608.19.90.00","B3 Duty / MFN":"14%","口径":"网类"},
    {"类别":"纺织制品","中英品名":"绳线制品 / articles of yarn cordage rope","材质/用途判断":"绳制挂件、绳制小件","HS6":"5609.00","10位申报":"5609.00.00.00","B3 Duty / MFN":"14%","口径":"绳线制成品"},
    {"类别":"纺织制品","中英品名":"织带-化纤 / narrow woven fabrics man-made","材质/用途判断":"涤纶织带、尼龙织带","HS6":"5806.32","10位申报":"5806.32.00.90","B3 Duty / MFN":"Free","口径":"窄幅织物"},
    {"类别":"纺织制品","中英品名":"布标签 / textile labels woven","材质/用途判断":"织唛、布标、缝标","HS6":"5807.10","10位申报":"5807.10.00.00","B3 Duty / MFN":"Free","口径":"纺织标签"},
    {"类别":"纺织制品","中英品名":"涂层纺织布 / coated textile fabric","材质/用途判断":"塑料涂层布、涂胶布","HS6":"5903.90","10位申报":"5903.90.20.00","B3 Duty / MFN":"Free","口径":"含化纤涂层布"},
    {"类别":"服装","中英品名":"针织T恤-棉 / knit cotton T-shirts","材质/用途判断":"T-shirt、背心；棉针织","HS6":"6109.10","10位申报":"6109.10.00.00","B3 Duty / MFN":"18%","口径":"针织上衣"},
    {"类别":"服装","中英品名":"针织T恤-其他 / knit other T-shirts","材质/用途判断":"T-shirt、背心；非棉","HS6":"6109.90","10位申报":"6109.90.00.90","B3 Duty / MFN":"18%","口径":"针织上衣"},
    {"类别":"服装","中英品名":"针织毛衫/卫衣-棉 / knit cotton sweaters sweatshirts","材质/用途判断":"套头衫、卫衣、开衫；棉","HS6":"6110.20","10位申报":"6110.20.00.90","B3 Duty / MFN":"18%","口径":"针织上装"},
    {"类别":"服装","中英品名":"针织毛衫/卫衣-化纤 / knit man-made sweaters","材质/用途判断":"套头衫、卫衣、开衫；化纤","HS6":"6110.30","10位申报":"6110.30.00.90","B3 Duty / MFN":"18%","口径":"针织上装"},
    {"类别":"服装","中英品名":"男裤-棉 / men cotton trousers","材质/用途判断":"男式长裤、短裤；梭织棉","HS6":"6203.42","10位申报":"6203.42.00.90","B3 Duty / MFN":"17%","口径":"男装裤类"},
    {"类别":"服装","中英品名":"女裤-棉 / women cotton trousers","材质/用途判断":"女式长裤、短裤；梭织棉","HS6":"6204.62","10位申报":"6204.62.00.90","B3 Duty / MFN":"17%","口径":"女装裤类"},
    {"类别":"服装","中英品名":"男衬衫-棉 / men cotton shirts","材质/用途判断":"男式梭织棉衬衫","HS6":"6205.20","10位申报":"6205.20.00.00","B3 Duty / MFN":"17%","口径":"男衬衫"},
    {"类别":"服装","中英品名":"女衬衫-棉 / women cotton blouses","材质/用途判断":"女式梭织棉衬衫/上衣","HS6":"6206.30","10位申报":"6206.30.00.00","B3 Duty / MFN":"17%","口径":"女衬衫"},
    {"类别":"服装","中英品名":"男外套-化纤 / men man-made jackets coats","材质/用途判断":"男式夹克、风衣、外套；化纤","HS6":"6201.40","10位申报":"6201.40.90.90","B3 Duty / MFN":"17%","口径":"男式外套"},
    {"类别":"服装","中英品名":"女外套-化纤 / women man-made jackets coats","材质/用途判断":"女式夹克、风衣、外套；化纤","HS6":"6202.40","10位申报":"6202.40.00.90","B3 Duty / MFN":"18%","口径":"女式外套"},
    {"类别":"服装","中英品名":"运动服/其他服装-化纤 / other garments man-made","材质/用途判断":"运动套装、休闲服；化纤","HS6":"6211.43","10位申报":"6211.43.90.00","B3 Duty / MFN":"18%","口径":"其他服装"},
    {"类别":"服装","中英品名":"服装附件 / clothing accessories","材质/用途判断":"围巾、袖套、领结等附件","HS6":"6217.10","10位申报":"6217.10.00.00","B3 Duty / MFN":"15%","口径":"服装附件"},
    {"类别":"服装","中英品名":"无纺/毡布服装 / garments of nonwoven felt","材质/用途判断":"一次性防护服、无纺布服装","HS6":"6210.10","10位申报":"6210.10.90.00","B3 Duty / MFN":"18%","口径":"特殊布料服装"},
    {"类别":"服装","中英品名":"婴儿服-棉针织 / babies cotton knit garments","材质/用途判断":"婴儿针织棉服装","HS6":"6111.20","10位申报":"6111.20.00.00","B3 Duty / MFN":"Free","口径":"婴儿针织"},
    {"类别":"服装","中英品名":"婴儿服-棉梭织 / babies cotton woven garments","材质/用途判断":"婴儿梭织棉服装","HS6":"6209.20","10位申报":"6209.20.00.00","B3 Duty / MFN":"Free","口径":"婴儿梭织"},
    {"类别":"鞋靴","中英品名":"橡塑鞋 / rubber plastic footwear","材质/用途判断":"鞋面/鞋底为橡胶或塑料","HS6":"6402.99","10位申报":"6402.99.90.00","B3 Duty / MFN":"17.5%","口径":"普通塑胶鞋"},
    {"类别":"鞋靴","中英品名":"纺织面鞋 / textile upper footwear","材质/用途判断":"鞋面为纺织材料","HS6":"6404.19","10位申报":"6404.19.90.00","B3 Duty / MFN":"18%","口径":"普通纺织鞋"},
    {"类别":"鞋靴","中英品名":"鞋类零件 / footwear parts","材质/用途判断":"鞋底、鞋面、鞋垫等零件","HS6":"6406.90","10位申报":"6406.90.90.00","B3 Duty / MFN":"5%","口径":"鞋配件"},
    {"类别":"帽子","中英品名":"帽子-针织/钩编 / knitted hats caps","材质/用途判断":"针织帽、棒球帽常见布帽","HS6":"6505.00","10位申报":"6505.00.90.90","B3 Duty / MFN":"15.5%","口径":"帽类"},
    {"类别":"雨伞","中英品名":"伞 / umbrellas","材质/用途判断":"雨伞、太阳伞","HS6":"6601.99","10位申报":"6601.99.00.90","B3 Duty / MFN":"7.5%","口径":"伞类"},
    {"类别":"箱包","中英品名":"旅行箱 / suitcases trunks","材质/用途判断":"外表塑料/纺织/皮革旅行箱","HS6":"4202.12","10位申报":"4202.12.90.00","B3 Duty / MFN":"11%","口径":"旅行容器"},
    {"类别":"箱包","中英品名":"手提包 / handbags","材质/用途判断":"女士包、手提包；外表非皮革常见","HS6":"4202.22","10位申报":"4202.22.90.90","B3 Duty / MFN":"10.5%","口径":"手提包"},
    {"类别":"箱包","中英品名":"小钱包/卡包 / wallets purses","材质/用途判断":"钱包、卡包、小票夹","HS6":"4202.32","10位申报":"4202.32.90.90","B3 Duty / MFN":"8%","口径":"口袋/手袋内小容器"},
    {"类别":"箱包","中英品名":"背包/收纳包 / backpacks storage bags","材质/用途判断":"背包、工具包、化妆包、收纳包","HS6":"4202.92","10位申报":"4202.92.90.00","B3 Duty / MFN":"7%","口径":"类似容器"},
    {"类别":"宠物用品","中英品名":"宠物项圈牵引绳 / pet collars leashes harness","材质/用途判断":"动物项圈、牵引带、胸背带","HS6":"4201.00","10位申报":"4201.00.90.90","B3 Duty / MFN":"7%","口径":"动物鞍具/挽具"},
    {"类别":"宠物用品","中英品名":"宠物衣服 / dog coats pet clothes","材质/用途判断":"宠物穿戴衣服、狗衣","HS6":"4201.00","10位申报":"4201.00.90.90","B3 Duty / MFN":"7%","口径":"动物用品"},
    {"类别":"塑料制品","中英品名":"塑料宠物用品 / plastic pet articles","材质/用途判断":"塑料宠物碗、拾便器、玩具非儿童","HS6":"3926.90","10位申报":"3926.90.99.90","B3 Duty / MFN":"6.5%","口径":"塑料杂项"},
    {"类别":"钢铁制品","中英品名":"不锈钢厨房用品 / stainless steel kitchenware","材质/用途判断":"不锈钢锅具、餐厨器皿","HS6":"7323.93","10位申报":"7323.93.90.90","B3 Duty / MFN":"6.5%","口径":"不锈钢餐厨"},
    {"类别":"钢铁制品","中英品名":"其他钢铁家用餐厨品 / other iron steel household articles","材质/用途判断":"铁制家居/厨房用品","HS6":"7323.99","10位申报":"7323.99.00.90","B3 Duty / MFN":"6.5%","口径":"钢铁家用"},
    {"类别":"金属五金","中英品名":"家具五金 / furniture fittings","材质/用途判断":"铰链、拉手、滑轨、家具支架","HS6":"8302.42","10位申报":"8302.42.00.90","B3 Duty / MFN":"Free","口径":"家具专用五金"},
    {"类别":"金属五金","中英品名":"其他安装五金 / base metal mountings fittings","材质/用途判断":"挂钩、支架、安装件、门窗五金","HS6":"8302.49","10位申报":"8302.49.00.90","B3 Duty / MFN":"Free","口径":"通用安装五金"},
    {"类别":"金属五金","中英品名":"金属装饰摆件 / base metal ornaments","材质/用途判断":"金属摆件、装饰件、铃铛等","HS6":"8306.29","10位申报":"8306.29.00.00","B3 Duty / MFN":"6.5%","口径":"贱金属装饰"},
    {"类别":"金属五金","中英品名":"金属相框镜框 / metal photo frames mirrors","材质/用途判断":"相框、图片框、镜框","HS6":"8306.30","10位申报":"8306.30.00.00","B3 Duty / MFN":"6%","口径":"框/镜"},
    {"类别":"刀剪餐具","中英品名":"固定刀 / fixed blade knives","材质/用途判断":"厨房刀、工具刀、固定刀刃","HS6":"8211.92","10位申报":"8211.92.00.00","B3 Duty / MFN":"7%","口径":"刀具"},
    {"类别":"刀剪餐具","中英品名":"剪刀 / scissors shears","材质/用途判断":"剪刀、裁缝剪","HS6":"8213.00","10位申报":"8213.00.10.00","B3 Duty / MFN":"11%","口径":"剪刀"},
    {"类别":"刀剪餐具","中英品名":"餐具刀叉勺 / cutlery spoons forks knives","材质/用途判断":"餐叉、餐勺、成套餐具","HS6":"8215.99","10位申报":"8215.99.10.00","B3 Duty / MFN":"11%","口径":"餐桌用刀叉勺"},
    {"类别":"手工具","中英品名":"家用手工具 / household hand tools","材质/用途判断":"开罐器、螺丝刀类非电动工具","HS6":"8205.51","10位申报":"8205.51.90.00","B3 Duty / MFN":"6.5%","口径":"手工具"},
    {"类别":"手工具","中英品名":"钳子镊子 / pliers tweezers","材质/用途判断":"钳子、剪钳、镊子","HS6":"8203.20","10位申报":"8203.20.00.00","B3 Duty / MFN":"6.5%","口径":"手工具"},
    {"类别":"手工具","中英品名":"园艺剪 / secateurs pruners","材质/用途判断":"修枝剪、单手剪","HS6":"8201.50","10位申报":"8201.50.00.00","B3 Duty / MFN":"Free","口径":"园艺工具"},
    {"类别":"手工具","中英品名":"耙锄镐 / rakes hoes picks","材质/用途判断":"耙子、锄头、镐","HS6":"8201.30","10位申报":"8201.30.90.00","B3 Duty / MFN":"6%","口径":"园艺农具"},
    {"类别":"铝制品","中英品名":"铝制杂项 / aluminium articles","材质/用途判断":"铝制小件、支架、外壳、配件","HS6":"7616.99","10位申报":"7616.99.90.90","B3 Duty / MFN":"6.5%","口径":"铝杂项"},
    {"类别":"铝制品","中英品名":"铝餐厨家用品 / aluminium kitchen household articles","材质/用途判断":"铝制锅具、厨房用品、家用品","HS6":"7615.10","10位申报":"7615.10.00.90","B3 Duty / MFN":"6.5%","口径":"铝家用"},
    {"类别":"铝制品","中英品名":"铝卫生用品 / aluminium sanitary ware","材质/用途判断":"铝制卫生洁具及零件","HS6":"7615.20","10位申报":"7615.20.00.00","B3 Duty / MFN":"6.5%","口径":"铝卫生洁具"},
    {"类别":"陶瓷制品","中英品名":"陶瓷餐厨用品 / ceramic tableware kitchenware","材质/用途判断":"非瓷普通陶瓷盘碗杯","HS6":"6912.00","10位申报":"6912.00.90.10","B3 Duty / MFN":"7%","口径":"陶瓷餐厨"},
    {"类别":"陶瓷制品","中英品名":"瓷餐具 / porcelain tableware","材质/用途判断":"瓷盘、瓷碗、瓷杯","HS6":"6911.10","10位申报":"6911.10.90.90","B3 Duty / MFN":"7%","口径":"瓷餐具"},
    {"类别":"陶瓷制品","中英品名":"陶瓷装饰品 / ceramic ornaments","材质/用途判断":"陶瓷摆件、工艺品","HS6":"6913.90","10位申报":"6913.90.90.00","B3 Duty / MFN":"6.5%","口径":"陶瓷装饰"},
    {"类别":"玻璃制品","中英品名":"玻璃杯器皿 / glass drinking glasses","材质/用途判断":"玻璃杯、酒杯、饮水杯","HS6":"7013.37","10位申报":"7013.37.00.00","B3 Duty / MFN":"Free","口径":"玻璃饮具"},
    {"类别":"玻璃制品","中英品名":"玻璃餐厨器皿 / glass table kitchenware","材质/用途判断":"玻璃盘、碗、罐、餐厨器皿","HS6":"7013.49","10位申报":"7013.49.00.90","B3 Duty / MFN":"Free","口径":"玻璃餐厨"},
    {"类别":"玻璃制品","中英品名":"其他玻璃制品 / other glass articles","材质/用途判断":"玻璃摆件、玻璃罩、玻璃小件","HS6":"7020.00","10位申报":"7020.00.90.00","B3 Duty / MFN":"6.5%","口径":"玻璃杂项"},
    {"类别":"玻璃制品","中英品名":"镜子 / glass mirrors framed","材质/用途判断":"玻璃镜、带框镜","HS6":"7009.92","10位申报":"7009.92.00.00","B3 Duty / MFN":"Free","口径":"带框镜"},
    {"类别":"木制品","中英品名":"木制餐厨用品 / wooden table kitchenware","材质/用途判断":"木勺、木碗、木菜板、木厨具","HS6":"4419.90","10位申报":"4419.90.00.00","B3 Duty / MFN":"6%","口径":"木餐厨"},
    {"类别":"木制品","中英品名":"其他木制品 / other wooden articles","材质/用途判断":"木挂件、木架、木制小件","HS6":"4421.99","10位申报":"4421.99.90.90","B3 Duty / MFN":"6%","口径":"木杂项"},
    {"类别":"木制品","中英品名":"木质装饰盒摆件 / wooden ornaments boxes","材质/用途判断":"木盒、木摆件、装饰木件","HS6":"4420.90","10位申报":"4420.90.00.00","B3 Duty / MFN":"7%","口径":"木装饰/盒"},
    {"类别":"竹藤编制品","中英品名":"竹/藤编篮筐 / basketware wickerwork","材质/用途判断":"竹篮、藤篮、编织收纳筐","HS6":"4602.90","10位申报":"4602.90.90.00","B3 Duty / MFN":"8%","口径":"编结制品"},
    {"类别":"家具","中英品名":"金属家具 / metal furniture","材质/用途判断":"金属架、金属桌椅、金属置物架","HS6":"9403.20","10位申报":"9403.20.00.90","B3 Duty / MFN":"8%","口径":"家具整件"},
    {"类别":"家具","中英品名":"木家具 / wooden furniture","材质/用途判断":"木桌、木柜、木架，非座椅","HS6":"9403.60","10位申报":"9403.60.10.99","B3 Duty / MFN":"9.5%","口径":"家具整件"},
    {"类别":"家具","中英品名":"其他座椅 / other seats","材质/用途判断":"塑料椅、软椅、无金属框架座椅","HS6":"9401.80","10位申报":"9401.80.10.00","B3 Duty / MFN":"9.5%","口径":"家用座椅"},
    {"类别":"床品","中英品名":"睡袋 / sleeping bags","材质/用途判断":"露营睡袋","HS6":"9404.30","10位申报":"9404.30.00.00","B3 Duty / MFN":"15.5%","口径":"睡袋"},
    {"类别":"灯具","中英品名":"LED吊灯壁灯 / LED chandeliers wall lights","材质/用途判断":"固定式灯具，仅LED光源","HS6":"9405.11","10位申报":"9405.11.00.90","B3 Duty / MFN":"7%","口径":"固定照明"},
    {"类别":"灯具","中英品名":"LED其他电灯具 / LED electric lamps luminaires","材质/用途判断":"LED台灯、便携灯、灯带等","HS6":"9405.42","10位申报":"9405.42.90.00","B3 Duty / MFN":"7%","口径":"LED电灯具"},
    {"类别":"灯具","中英品名":"其他电灯具 / other electric luminaires","材质/用途判断":"非LED或不明电灯具","HS6":"9405.49","10位申报":"9405.49.90.00","B3 Duty / MFN":"7%","口径":"其他电灯具"},
    {"类别":"灯具","中英品名":"非电灯具 / non-electrical luminaires","材质/用途判断":"烛台、非电灯、装饰灯座","HS6":"9405.50","10位申报":"9405.50.90.00","B3 Duty / MFN":"7%","口径":"非电照明"},
    {"类别":"电子音频","中英品名":"其他通信设备 / other telecom apparatus","材质/用途判断":"接收器、通信装置未列名","HS6":"8517.69","10位申报":"8517.69.00.90","B3 Duty / MFN":"Free","口径":"通信类"},
    {"类别":"电子音频","中英品名":"麦克风 / microphones","材质/用途判断":"麦克风及支架","HS6":"8518.10","10位申报":"8518.10.00.00","B3 Duty / MFN":"Free","口径":"音频输入"},
    {"类别":"电子音频","中英品名":"单喇叭音箱 / single loudspeakers","材质/用途判断":"单个扬声器音箱","HS6":"8518.21","10位申报":"8518.21.00.00","B3 Duty / MFN":"Free","口径":"音箱"},
    {"类别":"电子音频","中英品名":"多喇叭音箱 / multiple loudspeakers","材质/用途判断":"多扬声器音箱","HS6":"8518.22","10位申报":"8518.22.00.00","B3 Duty / MFN":"Free","口径":"音箱"},
    {"类别":"电子音频","中英品名":"耳机 / headphones earphones","材质/用途判断":"耳机、耳麦","HS6":"8518.30","10位申报":"8518.30.90.10","B3 Duty / MFN":"Free","口径":"音频输出"},
    {"类别":"电源电池","中英品名":"充电器/电源适配器 / chargers adapters","材质/用途判断":"AC/DC适配器、USB充电器","HS6":"8504.40","10位申报":"8504.40.90.90","B3 Duty / MFN":"Free","口径":"电源转换"},
    {"类别":"电子电器机械","中英品名":"带接头电缆 / electric cables with connectors","材质/用途判断":"USB线、电源线、连接线","HS6":"8544.42","10位申报":"8544.42.00.90","B3 Duty / MFN":"Free","口径":"带接头线缆"},
    {"类别":"电子电器机械","中英品名":"无接头电线电缆 / electric wires cables no connectors","材质/用途判断":"绝缘电线、电缆，无接头","HS6":"8544.49","10位申报":"8544.49.00.90","B3 Duty / MFN":"Free","口径":"绝缘线缆"},
    {"类别":"电源电池","中英品名":"锂离子电池 / lithium-ion batteries","材质/用途判断":"可充电锂电池、移动电源电芯","HS6":"8507.60","10位申报":"8507.60.90.00","B3 Duty / MFN":"7%","口径":"蓄电池"},
    {"类别":"电源电池","中英品名":"普通干电池 / primary batteries","材质/用途判断":"一次性干电池、碱性电池","HS6":"8506.10","10位申报":"8506.10.90.00","B3 Duty / MFN":"7%","口径":"原电池"},
    {"类别":"风机","中英品名":"手持/台式风扇 / table floor wall fans","材质/用途判断":"小风扇、台扇、落地扇","HS6":"8414.51","10位申报":"8414.51.90.90","B3 Duty / MFN":"Free","口径":"风扇整机"},
    {"类别":"风机","中英品名":"其他风机 / other fans blowers","材质/用途判断":"鼓风机、散热风扇、其他风机","HS6":"8414.59","10位申报":"8414.59.00.90","B3 Duty / MFN":"Free","口径":"风机整机"},
    {"类别":"风机","中英品名":"风扇/风机零件 / fan parts","材质/用途判断":"风叶、风扇配件、风机零件","HS6":"8414.90","10位申报":"8414.90.90.90","B3 Duty / MFN":"Free","口径":"零件"},
    {"类别":"吸尘器","中英品名":"吸尘器 / vacuum cleaners","材质/用途判断":"家用吸尘器","HS6":"8508.11","10位申报":"8508.11.00.00","B3 Duty / MFN":"8%","口径":"吸尘整机"},
    {"类别":"吸尘器","中英品名":"吸尘器零件 / vacuum cleaner parts","材质/用途判断":"吸尘器配件、刷头、滤件","HS6":"8508.70","10位申报":"8508.70.00.00","B3 Duty / MFN":"Free","口径":"零件"},
    {"类别":"小家电","中英品名":"电热水壶/热水器 / electric water heaters kettles","材质/用途判断":"电热水壶、热水器、浸入式加热器","HS6":"8516.10","10位申报":"8516.10.90.90","B3 Duty / MFN":"6.5%","口径":"电热水"},
    {"类别":"小家电","中英品名":"电烤箱/电炉/电饭锅 / electric ovens cookers","材质/用途判断":"电饭锅、电烤箱、台式电热烹饪","HS6":"8516.60","10位申报":"8516.60.90.10","B3 Duty / MFN":"8%","口径":"电热烹饪"},
    {"类别":"小家电","中英品名":"咖啡/茶机 / coffee tea makers","材质/用途判断":"咖啡机、茶机","HS6":"8516.71","10位申报":"8516.71.10.00","B3 Duty / MFN":"9%","口径":"电热饮品"},
    {"类别":"小家电","中英品名":"其他电热器具 / other electro-thermic appliances","材质/用途判断":"暖手器、热熔器、电热小件","HS6":"8516.79","10位申报":"8516.79.90.00","B3 Duty / MFN":"6.5%","口径":"电热器具"},
    {"类别":"小家电","中英品名":"电动理发器 / hair clippers","材质/用途判断":"宠物/人用电推剪、理发器","HS6":"8510.20","10位申报":"8510.20.90.00","B3 Duty / MFN":"Free","口径":"电动剪"},
    {"类别":"电气元件","中英品名":"开关 / electrical switches","材质/用途判断":"电气开关、按钮、旋钮开关","HS6":"8536.50","10位申报":"8536.50.90.90","B3 Duty / MFN":"Free","口径":"电路开关"},
    {"类别":"电气元件","中英品名":"插头插座 / plugs sockets","材质/用途判断":"插头、插座、连接器","HS6":"8536.69","10位申报":"8536.69.00.90","B3 Duty / MFN":"Free","口径":"电连接"},
    {"类别":"影像显示","中英品名":"摄像头/相机模块 / cameras","材质/用途判断":"数码摄像头、监控摄像头","HS6":"8525.89","10位申报":"8525.89.00.90","B3 Duty / MFN":"Free","口径":"摄像设备"},
    {"类别":"影像显示","中英品名":"显示器 / monitors","材质/用途判断":"电脑显示器、屏幕","HS6":"8528.52","10位申报":"8528.52.00.00","B3 Duty / MFN":"Free","口径":"显示设备"},
    {"类别":"电脑配件","中英品名":"键盘鼠标输入输出 / computer input output units","材质/用途判断":"键盘、鼠标、扫描仪等电脑外设","HS6":"8471.60","10位申报":"8471.60.00.90","B3 Duty / MFN":"Free","口径":"电脑外设"},
    {"类别":"电脑配件","中英品名":"电脑零件 / computer parts accessories","材质/用途判断":"电脑配件、主机配件、支架外壳","HS6":"8473.30","10位申报":"8473.30.90.00","B3 Duty / MFN":"Free","口径":"电脑专用零件"},
    {"类别":"机械器具","中英品名":"电动/气动手提工具 / power hand tools","材质/用途判断":"电钻、电动螺丝刀、打磨机","HS6":"8467.29","10位申报":"8467.29.00.90","B3 Duty / MFN":"Free","口径":"手持动力工具"},
    {"类别":"机械器具","中英品名":"喷雾/喷洒器具 / sprayers spray guns","材质/用途判断":"喷壶、喷枪、喷雾器","HS6":"8424.20","10位申报":"8424.20.00.00","B3 Duty / MFN":"Free","口径":"喷射器具"},
    {"类别":"机械器具","中英品名":"其他喷洒机械 / other spraying appliances","材质/用途判断":"园艺喷洒、清洁喷雾设备","HS6":"8424.89","10位申报":"8424.89.00.00","B3 Duty / MFN":"Free","口径":"机械喷洒"},
    {"类别":"机械器具","中英品名":"阀门 / taps valves","材质/用途判断":"水龙头、阀门、球阀","HS6":"8481.80","10位申报":"8481.80.00.90","B3 Duty / MFN":"Free","口径":"管路控制"},
    {"类别":"机械器具","中英品名":"过滤器 / filtering apparatus","材质/用途判断":"过滤器、净化器滤芯设备","HS6":"8421.39","10位申报":"8421.39.00.90","B3 Duty / MFN":"Free","口径":"过滤净化"},
    {"类别":"玩具","中英品名":"普通玩具 / toys","材质/用途判断":"儿童玩具、拼装玩具、玩具套装","HS6":"9503.00","10位申报":"9503.00.90.90","B3 Duty / MFN":"Free","口径":"玩具"},
    {"类别":"节庆用品","中英品名":"圣诞用品 / Christmas articles","材质/用途判断":"圣诞装饰、圣诞树用品","HS6":"9505.10","10位申报":"9505.10.00.00","B3 Duty / MFN":"Free","口径":"节日用品"},
    {"类别":"节庆用品","中英品名":"派对节庆用品 / party festive articles","材质/用途判断":"派对旗、节日装饰、狂欢用品","HS6":"9505.90","10位申报":"9505.90.00.90","B3 Duty / MFN":"Free","口径":"节庆用品"},
    {"类别":"游戏用品","中英品名":"桌游/游戏用品 / games","材质/用途判断":"桌游、棋牌、游戏配件","HS6":"9504.90","10位申报":"9504.90.00.90","B3 Duty / MFN":"Free","口径":"游戏用品"},
    {"类别":"运动用品","中英品名":"运动器材 / sports equipment","材质/用途判断":"训练器材、运动用品未列名","HS6":"9506.99","10位申报":"9506.99.00.90","B3 Duty / MFN":"Free","口径":"运动用品"},
    {"类别":"运动用品","中英品名":"健身器材 / exercise equipment","材质/用途判断":"健身用品、瑜伽训练器材","HS6":"9506.91","10位申报":"9506.91.00.90","B3 Duty / MFN":"Free","口径":"健身"},
    {"类别":"运动用品","中英品名":"球类-充气 / inflatable balls","材质/用途判断":"篮球、足球、排球等充气球","HS6":"9506.62","10位申报":"9506.62.00.00","B3 Duty / MFN":"Free","口径":"运动球"},
    {"类别":"钓具","中英品名":"钓竿 / fishing rods","材质/用途判断":"钓鱼竿","HS6":"9507.10","10位申报":"9507.10.90.00","B3 Duty / MFN":"6.5%","口径":"钓具"},
    {"类别":"钓具","中英品名":"鱼钩 / fish-hooks","材质/用途判断":"鱼钩、带线鱼钩","HS6":"9507.20","10位申报":"9507.20.00.00","B3 Duty / MFN":"Free","口径":"钓具"},
    {"类别":"钓具","中英品名":"其他钓具 / fishing tackle","材质/用途判断":"鱼线轮以外钓具、渔网兜","HS6":"9507.90","10位申报":"9507.90.99.20","B3 Duty / MFN":"6.5%","口径":"钓具"},
    {"类别":"纺织制品","中英品名":"花园网/货网 / garden cargo nets","材质/用途判断":"网类，绳线材料制","HS6":"5608.19","10位申报":"5608.19.90.00","B3 Duty / MFN":"14%","口径":"网类"},
    {"类别":"塑料制品","中英品名":"花园塑料用品 / garden plastic articles","材质/用途判断":"花盆、园艺夹、插牌、塑料园艺小件","HS6":"3926.90","10位申报":"3926.90.99.90","B3 Duty / MFN":"6.5%","口径":"塑料园艺"},
    {"类别":"人造花","中英品名":"人工花-塑料 / artificial flowers plastic","材质/用途判断":"塑料假花、人造植物","HS6":"6702.10","10位申报":"6702.10.00.00","B3 Duty / MFN":"5%","口径":"人造花"},
    {"类别":"人造花","中英品名":"人工花-其他材料 / artificial flowers other","材质/用途判断":"布花、纸花等人造植物","HS6":"6702.90","10位申报":"6702.90.90.00","B3 Duty / MFN":"6.5%","口径":"人造花"},
    {"类别":"胶粘剂","中英品名":"零售包装胶水 / retail glues adhesives","材质/用途判断":"小支胶水、零售包装胶粘剂","HS6":"3506.10","10位申报":"3506.10.00.00","B3 Duty / MFN":"6.5%","口径":"胶粘剂"},
    {"类别":"清洁剂","中英品名":"清洁剂/洗涤剂 / detergents cleaning preparations","材质/用途判断":"洗衣液、洗洁精、清洁剂零售","HS6":"3402.50","10位申报":"3402.50.90.90","B3 Duty / MFN":"6.5%","口径":"清洁制剂"},
    {"类别":"洗护用品","中英品名":"洗手液/洁肤制品 / skin washing preparations","材质/用途判断":"洗手液、沐浴清洁制品","HS6":"3401.30","10位申报":"3401.30.00.00","B3 Duty / MFN":"6.5%","口径":"洁肤"},
    {"类别":"蜡烛","中英品名":"蜡烛-节庆 / festive candles","材质/用途判断":"生日蜡烛、圣诞蜡烛","HS6":"3406.00","10位申报":"3406.00.10.00","B3 Duty / MFN":"5.5%","口径":"节庆蜡烛"},
    {"类别":"蜡烛","中英品名":"普通蜡烛 / candles","材质/用途判断":"香薰蜡烛、装饰蜡烛","HS6":"3406.00","10位申报":"3406.00.90.00","B3 Duty / MFN":"5.5%","口径":"非节庆蜡烛"},
    {"类别":"颜料","中英品名":"绘画颜料 / artists colours","材质/用途判断":"颜料、绘画套装中颜料","HS6":"3213.90","10位申报":"3213.90.90.00","B3 Duty / MFN":"6.5%","口径":"艺术颜料"},
    {"类别":"涂料","中英品名":"油漆/清漆 / paints varnishes","材质/用途判断":"非水性漆、清漆、涂料","HS6":"3208.90","10位申报":"3208.90.90.90","B3 Duty / MFN":"6.5%","口径":"涂料"},
    {"类别":"油墨","中英品名":"油墨 / inks","材质/用途判断":"印刷/书写用墨、墨水","HS6":"3215.90","10位申报":"3215.90.00.00","B3 Duty / MFN":"Free","口径":"墨类"},
    {"类别":"塑料制品","中英品名":"硅胶原料 / silicones primary forms","材质/用途判断":"硅酮、硅胶初级形态","HS6":"3910.00","10位申报":"3910.00.00.00","B3 Duty / MFN":"Free","口径":"初级形态"},
    {"类别":"塑料制品","中英品名":"丙烯酸树脂 / acrylic polymers","材质/用途判断":"丙烯酸树脂初级形态","HS6":"3906.90","10位申报":"3906.90.00.90","B3 Duty / MFN":"Free","口径":"初级形态"},
    {"类别":"化工原料","中英品名":"溶剂稀释剂 / solvents thinners","材质/用途判断":"有机复合溶剂、稀释剂","HS6":"3814.00","10位申报":"3814.00.00.00","B3 Duty / MFN":"Free","口径":"溶剂"},
    {"类别":"塑料制品","中英品名":"塑料钥匙扣 / plastic keychains","材质/用途判断":"塑料钥匙扣、塑料挂件","HS6":"3926.90","10位申报":"3926.90.99.90","B3 Duty / MFN":"6.5%","口径":"塑料杂项"},
    {"类别":"钟表","中英品名":"手表 / wrist-watches","材质/用途判断":"电子/石英手表","HS6":"9102.12","10位申报":"9102.12.00.00","B3 Duty / MFN":"5%","口径":"手表"},
    {"类别":"钟表","中英品名":"表带-塑料/橡胶/纺织 / watch straps non-metal","材质/用途判断":"塑料、橡胶、纺织表带","HS6":"9113.90","10位申报":"9113.90.00.90","B3 Duty / MFN":"Free","口径":"表带"},
    {"类别":"钟表","中英品名":"钟 / clocks","材质/用途判断":"挂钟、闹钟、座钟","HS6":"9105.21","10位申报":"9105.21.90.00","B3 Duty / MFN":"14%","口径":"钟表"},
    {"类别":"服装辅料","中英品名":"拉链 / slide fasteners","材质/用途判断":"拉链、拉链条","HS6":"9607.19","10位申报":"9607.19.00.00","B3 Duty / MFN":"11%","口径":"拉链"},
    {"类别":"服装辅料","中英品名":"纽扣 / buttons","材质/用途判断":"塑料/金属/其他纽扣","HS6":"9606.29","10位申报":"9606.29.00.90","B3 Duty / MFN":"Free","口径":"纽扣"},
    {"类别":"刷类","中英品名":"刷子 / brushes","材质/用途判断":"清洁刷、化妆刷、普通刷","HS6":"9603.90","10位申报":"9603.90.90.00","B3 Duty / MFN":"6.5%","口径":"刷类"},
    {"类别":"发饰梳具","中英品名":"梳子发夹 / combs hair slides","材质/用途判断":"梳子、发夹、发卡","HS6":"9615.19","10位申报":"9615.19.00.90","B3 Duty / MFN":"7%","口径":"头发用品"},
    {"类别":"保温容器","中英品名":"保温杯/保温瓶 / vacuum flasks","材质/用途判断":"保温杯、保温瓶、真空容器","HS6":"9617.00","10位申报":"9617.00.00.00","B3 Duty / MFN":"7.5%","口径":"真空保温"},
    {"类别":"车辆配件","中英品名":"机动车通用零件 / motor vehicle parts","材质/用途判断":"汽车配件，确认专用于机动车","HS6":"8708.99","10位申报":"8708.99.99.99","B3 Duty / MFN":"6%","口径":"车辆零件"},
    {"类别":"自行车","中英品名":"自行车 / bicycles","材质/用途判断":"普通自行车、非电动","HS6":"8712.00","10位申报":"8712.00.00.00","B3 Duty / MFN":"13%","口径":"整车"},
    {"类别":"婴童车","中英品名":"婴儿车 / baby carriages","材质/用途判断":"婴儿推车、童车","HS6":"8715.00","10位申报":"8715.00.00.00","B3 Duty / MFN":"8%","口径":"婴儿车"},
    {"类别":"婴童车","中英品名":"婴儿车零件 / baby carriage parts","材质/用途判断":"婴儿车配件","HS6":"8715.00","10位申报":"8715.00.00.90","B3 Duty / MFN":"8%","口径":"婴儿车零件"}
];

let allData = [];
let filteredData = [];
let activeFilters = new Set();
let draggedElement = null;
let columnOrder = ['类别', '中英品名', '材质/用途判断', 'HS6', '10位申报', 'B3 Duty / MFN', '口径'];

// 同义词和关联词库
const synonyms = {
    '瓶': ['瓶', '罐', '容器', 'bottle', 'flask'],
    '杆': ['杆', '竿', '柱', '棒', 'rod', 'pole'],
    '盖': ['盖', '盖子', '瓶盖', 'cap', 'lid', 'closure'],
    '袋': ['袋', '包装袋', '购物袋', 'bag', 'sack'],
    '箱': ['箱', '盒', '箱子', 'box', 'case', 'carton'],
    '纸': ['纸', '纸张', 'paper'],
    '塑料': ['塑料', '塑胶', 'plastic'],
    '橡胶': ['橡胶', '橡皮', 'rubber'],
    '金属': ['金属', '铁', '钢', '铝', 'metal', 'steel', 'aluminium'],
    '手套': ['手套', 'glove'],
    '笔': ['笔', '书写', 'pen', 'pencil'],
    '本': ['本', '本子', '笔记本', 'notebook', 'book'],
    '标签': ['标签', '吊牌', 'label', 'tag'],
    '印刷': ['印刷', '打印', 'print'],
    '文具': ['文具', '办公', 'stationery', 'office'],
    '家具': ['家具', 'furniture'],
    '厨房': ['厨房', '餐具', 'kitchen', 'tableware'],
    '卫生': ['卫生', '清洁', 'sanitary', 'cleaning']
};

// 材质类别映射
const materialCategories = {
    '旗杆': ['金属五金', '铝制品', '钢铁制品'],
    '水杯': ['塑料制品', '玻璃制品', '钢铁制品'],
    '衣架': ['塑料制品', '金属五金', '木制品'],
    '挂钩': ['金属五金', '塑料制品'],
    '盆': ['塑料制品', '钢铁制品'],
    '架子': ['金属五金', '塑料制品', '木制品']
};

// 数据版本号 - 每次更新数据时增加这个数字
const DATA_VERSION = 2;

// Firebase 配置 - 复刻旧网站的 REST API 保存方式
// 说明：这里使用旧项目同一个 Firebase Database，但保存到 hsCodeSystem/state.json，避免覆盖旧网站的 items.json。
const DATABASE_URL = "https://aoao-39647-default-rtdb.firebaseio.com";
const DATABASE_PATH = "hsCodeSystem/state";
const CORRECT_PASSWORD = "1140";
const SYNC_INTERVAL_MS = 3000;

let lastCloudSignature = '';
let syncTimer = null;
let isEditing = false;

function getCloudUrl() {
    return `${DATABASE_URL}/${DATABASE_PATH}.json`;
}

function makeStatePayload() {
    return {
        data: allData,
        columns: columnOrder,
        version: DATA_VERSION,
        updatedAt: new Date().toISOString()
    };
}

function setCloudStatus(text) {
    const statusEl = document.getElementById('cloudStatus');
    if (statusEl) statusEl.textContent = text;
}

function showMainContent() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    const mainContent = document.getElementById('mainContent');
    if (passwordOverlay) passwordOverlay.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
    setTimeout(() => {
        if (passwordOverlay) passwordOverlay.style.display = 'none';
    }, 300);
}

// 密码验证：和旧网站一样，属于简单访问门槛，不是严格安全登录
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    if (!passwordInput) return;

    if (passwordInput.value === CORRECT_PASSWORD) {
        sessionStorage.setItem('hsAuthenticated', 'true');
        showMainContent();
        init();
    } else {
        if (passwordError) passwordError.textContent = '❌ 密码错误，请重试';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('hsAuthenticated') === 'true';
    const passwordInput = document.getElementById('passwordInput');

    if (isAuthenticated) {
        showMainContent();
        init();
    } else if (passwordInput) {
        passwordInput.focus();
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }
}

// 初始化
async function init() {
    await loadData();
    renderCategoryFilters();
    renderTableHeader();
    renderTable();
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    startRealtimeSync();
}

function loadLocalData() {
    const savedVersion = localStorage.getItem('hsCodeDataVersion');
    const savedData = localStorage.getItem('hsCodeData');
    const savedColumns = localStorage.getItem('hsCodeColumns');

    if (savedData && savedVersion == DATA_VERSION) {
        allData = JSON.parse(savedData);
    } else {
        allData = initialData.map((item, index) => ({
            ...item,
            id: Date.now() + index,
            order: index
        }));
        localStorage.setItem('hsCodeDataVersion', DATA_VERSION);
    }

    if (savedColumns) {
        columnOrder = JSON.parse(savedColumns);
    }

    filteredData = [...allData];
}

function saveLocalData() {
    localStorage.setItem('hsCodeData', JSON.stringify(allData));
    localStorage.setItem('hsCodeColumns', JSON.stringify(columnOrder));
    localStorage.setItem('hsCodeDataVersion', DATA_VERSION);
}

// 加载数据：优先云端；云端没有时，用本地/初始数据并上传
async function loadData() {
    loadLocalData();
    setCloudStatus('正在连接云端...');

    try {
        const response = await fetch(getCloudUrl());
        const cloudState = await response.json();

        if (cloudState && Array.isArray(cloudState.data)) {
            allData = cloudState.data;
            columnOrder = Array.isArray(cloudState.columns) && cloudState.columns.length
                ? cloudState.columns
                : columnOrder;
            filteredData = [...allData];
            saveLocalData();
            lastCloudSignature = JSON.stringify({ data: allData, columns: columnOrder });
            setCloudStatus('云端已同步');
        } else {
            await saveData();
            setCloudStatus('已初始化云端数据');
        }
    } catch (error) {
        console.warn('无法连接云端，使用本地数据：', error);
        setCloudStatus('云端连接失败，当前使用本地数据');
    }
}

// 保存数据：先存本地，再写入 Firebase
async function saveData() {
    saveLocalData();
    const payload = makeStatePayload();
    lastCloudSignature = JSON.stringify({ data: payload.data, columns: payload.columns });
    setCloudStatus('正在保存...');

    try {
        const response = await fetch(getCloudUrl(), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setCloudStatus('已保存到云端');
        } else {
            const errorText = await response.text();
            console.error('云端保存失败：', response.status, errorText);
            setCloudStatus('云端保存失败，本地已保存');
        }
    } catch (error) {
        console.warn('无法连接云端，数据已保存到本地：', error);
        setCloudStatus('云端连接失败，本地已保存');
    }
}

// 多人同步：每3秒检查一次 Firebase 是否有新数据
function startRealtimeSync() {
    if (syncTimer) clearInterval(syncTimer);

    syncTimer = setInterval(async () => {
        if (isEditing) return;

        try {
            const response = await fetch(getCloudUrl());
            const cloudState = await response.json();

            if (!cloudState || !Array.isArray(cloudState.data)) return;

            const cloudSignature = JSON.stringify({
                data: cloudState.data,
                columns: cloudState.columns || columnOrder
            });

            if (cloudSignature !== lastCloudSignature) {
                allData = cloudState.data;
                columnOrder = Array.isArray(cloudState.columns) && cloudState.columns.length
                    ? cloudState.columns
                    : columnOrder;
                filteredData = [...allData];
                saveLocalData();
                lastCloudSignature = cloudSignature;

                applyFilters();
                renderTableHeader();
                renderCategoryFilters();
                setCloudStatus('检测到同事更新，已同步');
            }
        } catch (error) {
            console.warn('同步失败：', error);
        }
    }, SYNC_INTERVAL_MS);
}

// 渲染类别筛选器
function renderCategoryFilters() {
    const categories = new Set();
    allData.forEach(item => {
        if (item['类别']) {
            categories.add(item['类别'].trim());
        }
    });
    
    const filterContainer = document.getElementById('categoryFilters');
    filterContainer.innerHTML = '';
    
    const allTag = document.createElement('div');
    allTag.className = 'filter-tag active';
    allTag.textContent = '全部';
    allTag.onclick = () => toggleFilter('全部');
    filterContainer.appendChild(allTag);
    
    Array.from(categories).sort().forEach(cat => {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.textContent = cat;
        tag.onclick = () => toggleFilter(cat);
        filterContainer.appendChild(tag);
    });
}

// 切换筛选（单选模式）
function toggleFilter(category) {
    const tags = document.querySelectorAll('.filter-tag');
    
    // 移除所有active状态
    tags.forEach(tag => tag.classList.remove('active'));
    
    // 激活当前点击的标签
    tags.forEach(tag => {
        if (tag.textContent === category) {
            tag.classList.add('active');
        }
    });
    
    // 设置筛选
    if (category === '全部') {
        activeFilters.clear();
    } else {
        activeFilters.clear();
        activeFilters.add(category);
    }
    
    applyFilters();
}

// 应用筛选
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    filteredData = allData.filter(item => {
        if (activeFilters.size > 0) {
            const itemCategory = item['类别'] ? item['类别'].trim() : '';
            if (!activeFilters.has(itemCategory)) return false;
        }
        
        if (searchTerm) {
            const searchableText = Object.values(item).join(' ').toLowerCase();
            return searchableText.includes(searchTerm);
        }
        
        return true;
    });
    
    // 如果有搜索词但没结果，尝试智能推荐
    if (searchTerm && filteredData.length === 0) {
        const suggestions = getSmartSuggestions(searchTerm);
        renderTableWithSuggestions(suggestions);
    } else {
        renderTable();
    }
}

// 搜索处理
function handleSearch() {
    applyFilters();
}

// 渲染表头
function renderTableHeader() {
    const thead = document.querySelector('#tableHeader');
    thead.innerHTML = `
        <th style="width: 30px;"></th>
        <th style="width: 80px;">编号</th>
        ${columnOrder.map(col => `
            <th class="editable-header" data-field="${col}" onclick="editHeader(this, '${col}')">
                ${col} 
                <button class="delete-col-btn" onclick="event.stopPropagation(); deleteColumn('${col}')" title="删除此列">❌</button>
            </th>
        `).join('')}
        <th style="width: 50px;">操作</th>
    `;
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('dataTable');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${columnOrder.length + 3}" class="no-results">没有找到匹配的数据</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, index) => `
        <tr draggable="true" data-id="${item.id}">
            <td><span class="drag-handle">⋮⋮</span></td>
            <td>${index + 1}</td>
            ${columnOrder.map(col => {
                const value = item[col] || '';
                return `<td class="editable" onclick="editCell(this, ${item.id}, '${col}')">${value}</td>`;
            }).join('')}
            <td><button class="delete-btn" onclick="deleteItem(${item.id})">🗑️</button></td>
        </tr>
    `).join('');
    
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);
        row.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(this.parentNode, e.clientY);
    if (afterElement == null) {
        this.parentNode.appendChild(draggedElement);
    } else {
        this.parentNode.insertBefore(draggedElement, afterElement);
    }
    
    return false;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('tr:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    const rows = document.querySelectorAll('#dataTable tr');
    const newOrder = [];
    rows.forEach(row => {
        const id = parseInt(row.dataset.id);
        const item = allData.find(item => item.id === id);
        if (item) {
            newOrder.push(item);
        }
    });
    
    allData = newOrder.map((item, index) => ({
        ...item,
        order: index
    }));
    
    saveData();
    applyFilters();
}

// 智能搜索推荐
function getSmartSuggestions(searchTerm) {
    const suggestions = {
        keywords: new Set(),
        categories: new Set(),
        items: []
    };
    
    // 1. 拆字匹配：提取搜索词中的每个字
    const chars = searchTerm.split('');
    
    // 2. 同义词扩展
    let expandedTerms = [searchTerm];
    for (const [key, values] of Object.entries(synonyms)) {
        if (searchTerm.includes(key) || values.some(v => searchTerm.includes(v))) {
            expandedTerms.push(...values);
        }
    }
    
    // 3. 材质类别推荐
    for (const [keyword, categories] of Object.entries(materialCategories)) {
        if (searchTerm.includes(keyword)) {
            categories.forEach(cat => suggestions.categories.add(cat));
        }
    }
    
    // 4. 遍历所有数据找相关项
    allData.forEach(item => {
        const itemText = Object.values(item).join(' ').toLowerCase();
        let score = 0;
        
        // 完整词匹配
        if (expandedTerms.some(term => itemText.includes(term))) {
            score += 10;
        }
        
        // 单字匹配
        chars.forEach(char => {
            if (char.length > 0 && itemText.includes(char)) {
                score += 1;
            }
        });
        
        // 类别匹配
        if (suggestions.categories.has(item['类别'])) {
            score += 5;
        }
        
        if (score > 0) {
            suggestions.items.push({ item, score });
            suggestions.keywords.add(item['类别']);
        }
    });
    
    // 按分数排序
    suggestions.items.sort((a, b) => b.score - a.score);
    suggestions.items = suggestions.items.slice(0, 10).map(s => s.item);
    
    return suggestions;
}

// 渲染带推荐的表格
function renderTableWithSuggestions(suggestions) {
    const tbody = document.getElementById('dataTable');
    const searchTerm = document.getElementById('searchInput').value;
    
    let html = `<tr><td colspan="${columnOrder.length + 3}" class="no-results">没有找到"${searchTerm}"的完全匹配</td></tr>`;
    
    if (suggestions.items.length > 0 || suggestions.keywords.size > 0) {
        html += `<tr><td colspan="${columnOrder.length + 3}" style="padding: 0;">
            <div class="search-suggestions">
                <h3>您可能在找...</h3>`;
        
        // 显示相关类别
        if (suggestions.keywords.size > 0) {
            html += `<div style="margin-bottom: 12px;">
                <span style="font-size: 12px; color: #86868b; margin-right: 8px;">相关类别：</span>
                <div class="suggestion-items">`;
            suggestions.keywords.forEach(keyword => {
                html += `<span class="suggestion-item" onclick="searchByKeyword('${keyword}')">${keyword}</span>`;
            });
            html += `</div></div>`;
        }
        
        // 显示推荐条目关键词
        if (suggestions.items.length > 0) {
            const itemKeywords = new Set();
            suggestions.items.forEach(item => {
                const name = item['中英品名'] || '';
                // 提取中文部分的关键词
                const chinesePart = name.split('/')[0].trim();
                const words = chinesePart.split(/\s+/);
                words.forEach(word => {
                    if (word.length >= 2) itemKeywords.add(word);
                });
            });
            
            if (itemKeywords.size > 0) {
                html += `<div>
                    <span style="font-size: 12px; color: #86868b; margin-right: 8px;">试试搜索：</span>
                    <div class="suggestion-items">`;
                Array.from(itemKeywords).slice(0, 8).forEach(keyword => {
                    html += `<span class="suggestion-item" onclick="searchByKeyword('${keyword}')">${keyword}</span>`;
                });
                html += `</div></div>`;
            }
        }
        
        html += `</div></td></tr>`;
        
        // 显示推荐的条目
        if (suggestions.items.length > 0) {
            html += suggestions.items.map((item, index) => `
                <tr style="opacity: 0.7;">
                    <td></td>
                    <td style="color: #86868b;">${index + 1}</td>
                    ${columnOrder.map(col => {
                        const value = item[col] || '';
                        return `<td class="editable" onclick="editCell(this, ${item.id}, '${col}')">${value}</td>`;
                    }).join('')}
                    <td><button class="delete-btn" onclick="deleteItem(${item.id})">🗑️</button></td>
                </tr>
            `).join('');
        }
    }
    
    tbody.innerHTML = html;
}

// 根据关键词搜索
function searchByKeyword(keyword) {
    document.getElementById('searchInput').value = keyword;
    handleSearch();
}

// 编辑单元格
function editCell(cell, id, field) {
    isEditing = true;
    const item = allData.find(i => i.id === id);
    if (!item) return;
    
    const originalValue = item[field] || '';
    const isTextarea = field === '材质/用途判断' || field === '口径';
    
    const input = document.createElement(isTextarea ? 'textarea' : 'input');
    input.type = 'text';
    input.value = originalValue;
    
    input.onblur = () => {
        const newValue = input.value.trim();
        if (newValue !== originalValue) {
            item[field] = newValue;
            saveData();
            applyFilters();
        } else {
            renderTable();
        }
        isEditing = false;
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter' && !isTextarea) {
            input.blur();
        } else if (e.key === 'Escape') {
            isEditing = false;
            renderTable();
        }
    };
    
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.select();
}

// 编辑表头
function editHeader(th, oldName) {
    isEditing = true;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldName;
    input.style.width = '100%';
    
    input.onblur = () => {
        const newName = input.value.trim();
        if (newName && newName !== oldName) {
            const index = columnOrder.indexOf(oldName);
            if (index !== -1) {
                columnOrder[index] = newName;
            }
            
            allData = allData.map(item => {
                const newItem = { ...item };
                if (oldName in newItem) {
                    newItem[newName] = newItem[oldName];
                    delete newItem[oldName];
                }
                return newItem;
            });
            
            saveData();
            renderTableHeader();
            renderTable();
            renderCategoryFilters();
        } else {
            renderTableHeader();
        }
        isEditing = false;
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            isEditing = false;
            renderTableHeader();
        }
    };
    
    th.innerHTML = '';
    th.appendChild(input);
    input.focus();
    input.select();
}

// 删除列
function deleteColumn(colName) {
    if (!confirm(`确定要删除"${colName}"这一列吗？`)) return;
    
    columnOrder = columnOrder.filter(col => col !== colName);
    
    allData = allData.map(item => {
        const newItem = { ...item };
        delete newItem[colName];
        return newItem;
    });
    
    saveData();
    renderTableHeader();
    renderTable();
    renderCategoryFilters();
}

// 添加新列
function addNewColumn() {
    const colName = prompt('请输入新列名称：');
    if (!colName || !colName.trim()) return;
    
    const trimmedName = colName.trim();
    
    if (columnOrder.includes(trimmedName)) {
        alert('该列名已存在！');
        return;
    }
    
    columnOrder.push(trimmedName);
    
    allData = allData.map(item => ({
        ...item,
        [trimmedName]: ''
    }));
    
    saveData();
    renderTableHeader();
    renderTable();
}

// 删除条目
function deleteItem(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    allData = allData.filter(item => item.id !== id);
    saveData();
    applyFilters();
    renderCategoryFilters();
}

// 添加新条目
function addNewItem() {
    const newItem = {
        id: Date.now(),
        order: allData.length
    };
    
    columnOrder.forEach(col => {
        if (col === '类别') {
            newItem[col] = '未分类';
        } else if (col === '中英品名') {
            newItem[col] = '新条目 / new item';
        } else {
            newItem[col] = '';
        }
    });
    
    allData.unshift(newItem);
    saveData();
    applyFilters();
    renderCategoryFilters();
}

document.addEventListener('DOMContentLoaded', checkAuth);

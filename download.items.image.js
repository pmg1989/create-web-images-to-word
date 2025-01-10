"use strict";

const puppeteer = require("puppeteer");

const { delay, download, padStart } = require("./utils");

// 篆书
// const PATH_LIST = ["吴昌硕"];
// const IMAGES_DIR_PATH = `./images/篆书/${PATH_LIST[0]}`;
// const pageList = [
//   // /** 吴昌硕石鼓文唐诗三首，月落乌啼 */
//   "https://www.toutiao.com/article/7286833257789063716/?app=news_article&timestamp=1728369069&use_new_style=1&req_id=20241008143109DD7DEE2A90FCB08C63C8&group_id=7286833257789063716&share_token=8490C45F-F311-41AC-A664-96F5E9D4EE8E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // /** 《吴昌硕篆书部首一百法》书法教程 */
//   // "https://www.toutiao.com/article/7193704965666357772/?app=news_article&timestamp=1728527968&use_new_style=1&req_id=20241010103928F8AAE3714C299C66A992&group_id=7193704965666357772&share_token=B82A1348-6956-4397-99EE-1727367B4B6A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // /** 吴昌硕篆书《西泠印社记》 */
//   // "https://www.toutiao.com/article/7369882042505200167/?app=news_article&timestamp=1728540084&use_new_style=1&req_id=202410101401240F9ED9C32A53AE7EFDF9&group_id=7369882042505200167&share_token=0A484FFE-7C96-4C35-AE99-8E963957DEAA&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // /** 清吴昌硕篆书修震泽许塘记墨迹本 */
//   // "https://www.toutiao.com/article/7358739612464103972/?app=news_article&timestamp=1728548210&use_new_style=1&req_id=2024101016164900814CB4CE02228E4F9A&group_id=7358739612464103972&share_token=D3581190-B6E3-4DF9-A81F-34BE91061AEA&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 隶书 曹全碑
// const PATH_LIST = ["曹全碑"];
// const IMAGES_DIR_PATH = `./images/隶书/${PATH_LIST[0]}`;
// const pageList = [
//   // 春联 start
//   "https://www.toutiao.com/article/7055524026327892519/?app=news_article&timestamp=1730721446&use_new_style=1&req_id=20241104195725B2AB70EBAD8598156497&group_id=7055524026327892519&share_token=3ABAAC2A-1DF9-4E4C-8753-C4B8108B8226&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/6911926339956146700/?app=news_article&timestamp=1730701711&use_new_style=1&req_id=20241104142831DCD2EB04BC38CB2E2FF3&group_id=6911926339956146700&share_token=879BE962-3902-4061-B382-65C8BB09B345&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7049859859604423209/?app=news_article&timestamp=1730701663&use_new_style=1&req_id=202411041427421616B5290E7D1629A89A&group_id=7049859859604423209&share_token=3A8291F8-1E75-47BD-B4AE-AA9E519BDC34&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7188848139930780217/?app=news_article&timestamp=1730701622&use_new_style=1&req_id=20241104142702AF7A0A527F46002D6C20&group_id=7188848139930780217&share_token=C7D6B5DF-3315-4746-8CD0-66ECF0E82D50&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7314808679163855395/?app=news_article&timestamp=1730701521&use_new_style=1&req_id=202411041425212D5CE7F4B5133F2C0FF4&group_id=7314808679163855395&share_token=8D78DC5A-8551-494A-9035-9CFE8A669206&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/w/1811667846548491/?app=news_article&timestamp=1730701789&use_new_style=1&share_token=C7075C9A-4183-4557-80AC-9EB0A4A6CBA6&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // 春联 end
//   /** 曹全碑标准字帖，本帖共57页，共684字，喜欢隶书的收藏好了 */
//   // "https://www.toutiao.com/article/7338812422226117172/?app=news_article&timestamp=1727148611&use_new_style=1&req_id=2024092411301100B961EAE2EBB47B88DD&group_id=7338812422226117172&share_token=96DFCA5A-0D8D-4B21-8AE9-E687095017E3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7368703686865879578/?app=news_article&timestamp=1716869415&use_new_style=1&req_id=2024052812101482EFA173C0A154689890&group_id=7368703686865879578&share_token=068C3F3C-40DC-4A87-90EA-43F0FFBC1F4C&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7362574373963825690/?app=news_article&timestamp=1716869716&use_new_style=1&req_id=20240528121515237CB7F6795AA66B2D1C&group_id=7362574373963825690&share_token=1BE62534-22D1-44BA-A4F2-44B0CA1D71E8&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 楷书
const PATH_LIST = ["软笔", "颜体"];
const IMAGES_DIR_PATH = `./images/楷书/${PATH_LIST.join("/")}`;

const pageList = [
  /** 颜柳楷书对照字帖 */
  "https://www.toutiao.com/article/7421903462453002806/?app=news_article&timestamp=1736584181&use_new_style=1&req_id=202501111629402BF4B8DA19A73BB4ABED&group_id=7421903462453002806&share_token=7AFDD4D5-F90E-4B88-8B88-E81799D734B2&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /** 《多宝塔碑》宋拓版 */
  // "https://www.toutiao.com/article/7395464831031869987/?app=news_article&timestamp=1736309891&use_new_style=1&req_id=20250108121810C8DD41DE89C97AED6488&group_id=7395464831031869987&share_token=79BC1C4E-AC84-4863-8461-B820167B4A5F&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /** 《多宝塔碑》集字·唐诗2 */
  // "https://www.toutiao.com/article/6821505002733830663/?app=news_article&timestamp=1736310357&use_new_style=1&req_id=202501081225578F4782C4FB1E82EF336D&group_id=6821505002733830663&share_token=12CB648F-523E-4524-A135-148105A2E75D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /**《多宝塔碑》集字·唐诗 */
  // "https://www.toutiao.com/article/7403546057780773413/?app=news_article&timestamp=1736309862&use_new_style=1&req_id=202501081217413E4DC3DD53FE0AF16401&group_id=7403546057780773413&share_token=94A9552C-316A-4808-A2AC-D6CFE8DA3A6F&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /**《多宝塔碑》集字八言|九言联 */
  // "https://www.toutiao.com/article/7251936516585570816/?app=news_article&timestamp=1736309846&use_new_style=1&req_id=20250108121725225ABFE0877065ED7839&group_id=7251936516585570816&share_token=6E301021-E32E-47EC-B216-389DCCD721E2&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /**《多宝塔碑》集字楹联一 */
  // "https://www.toutiao.com/w/1806506595988556/?app=news_article&timestamp=1736309807&use_new_style=1&share_token=76A1C63E-3F18-4E93-82D4-F260FBA4E917&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // /**《多宝塔碑》集字楹联二 */
  // "https://www.toutiao.com/w/1798984811507785/?app=news_article&timestamp=1736309824&use_new_style=1&share_token=63BA2BA2-2ACA-42FF-B989-29DF223C12F7&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《大唐中兴颂》楷书 */
  // "https://www.toutiao.com/article/7454718393296437769/?app=news_article&timestamp=1736249696&use_new_style=1&req_id=202501071934553B2342207072439655D0&group_id=7454718393296437769&share_token=91F52EFF-C30E-44E5-9AAC-9D3D243AAD84&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《多宝塔碑》唐诗集字 */
  // "https://www.toutiao.com/article/7449766687454380553/?app=news_article&timestamp=1736249358&use_new_style=1&req_id=20250107192917C715A612C7F2299AD9C3&group_id=7449766687454380553&share_token=90C09AF2-6B37-4732-BCD2-D57DD956D506&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 颜体集字春联，欢喜登场 */
  //   // "https://www.toutiao.com/article/7051940129799176716/?app=news_article&timestamp=1736050492&use_new_style=1&req_id=202501051214515C7CA4C8B80C6CC6A389&group_id=7051940129799176716&share_token=83C06FE2-21E7-4C41-8597-E09880A2DC0D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 颜真卿楷书春联集字（有横批） */
  //   // "https://www.toutiao.com/article/7451502946392556042/?app=news_article&timestamp=1736050838&use_new_style=1&req_id=20250105122037CD45C8EAEDE30D86C4DE&group_id=7451502946392556042&share_token=6CB07A40-3CB5-449A-9612-A6FB7EB6F87A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《颜勤礼碑》楷书字帖 */
  // "https://www.toutiao.com/article/6849242895333982732/?app=news_article&timestamp=1735375665&use_new_style=1&req_id=202412281647443DACE18BD95111846C32&group_id=6849242895333982732&share_token=E77E3F98-AF91-443B-BCAF-0089D1F9B58D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《多宝塔碑》集字古诗 */
  //   // "https://www.toutiao.com/w/1812668096050176/?app=news_article&timestamp=1735371567&use_new_style=1&share_token=A0ECB470-9386-422A-93EC-9F5C3585F51B&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /**《裴将军诗帖》杨再春临 */
  // "https://www.toutiao.com/article/7418982414766113289/?app=news_article&timestamp=1735368496&use_new_style=1&req_id=20241228144816ECC7A648F2C11173DEBB&group_id=7418982414766113289&share_token=DEC847A5-2437-489F-A5E0-89D7F7B785F9&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《自书告身帖》楷书 */
  // "https://www.toutiao.com/article/7449207966806311433/?app=news_article&timestamp=1735362563&use_new_style=1&req_id=2024122813092361A806484D9A527017FB&group_id=7449207966806311433&share_token=EEA14111-8A41-44E9-B521-C0D5FC79EE73&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《多宝塔碑》标准字帖 */
  // "https://www.toutiao.com/article/7338808433564582435/?app=news_article&timestamp=1735212527&use_new_style=1&req_id=20241226192846433DFC0657DC1C91DD1F&group_id=7338808433564582435&share_token=33EB50BA-CC5E-4130-A4F9-F150A1425ADD&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /**《颜勤礼碑》集字春联 */
  //   // "https://www.toutiao.com/w/1816476393011292/?app=news_article&timestamp=1734346991&use_new_style=1&share_token=D5523BBD-D2A2-4241-8229-5E8AA5791523&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《颜勤礼碑》集字春联（新版） */
  //   // "https://www.toutiao.com/article/7338015443498500617/?app=news_article&timestamp=1734346850&use_new_style=1&req_id=20241216190049F3528BF746F07F9662A0&group_id=7338015443498500617&share_token=3ADF9B94-17B0-4EF2-BA4B-A29FCD60E8EB&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   /** 《多宝塔碑》集字春联 */
  //   // "https://www.toutiao.com/article/7444128088637604404/?app=news_article&timestamp=1734346547&use_new_style=1&req_id=2024121618554771A5378AA4775A884A3B&group_id=7444128088637604404&share_token=BAC40DB4-5F32-4D80-A5B6-543CD697862A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // /**《颜勤礼碑》集字：沁园春雪 */
  //   // "https://www.toutiao.com/article/7380666467278193186/?app=news_article&timestamp=1727166300&use_new_style=1&req_id=202409241624597085FAE47F56F5A84D98&group_id=7380666467278193186&share_token=ADD80C5E-03E4-4FEF-A75C-814AAAA7FC55&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // /** 硬笔楷书字体精讲50字 胡啸卿 - start */
  //   // "https://www.toutiao.com/article/7319325177366577714/?app=news_article&timestamp=1711358824&use_new_style=1&req_id=20240325172703C10FDAE34ED684892A02&group_id=7319325177366577714&share_token=25C53D66-B3B2-4CCA-81E9-36444107BB41&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7319657865366176293/?app=news_article&timestamp=1711358043&use_new_style=1&req_id=2024032517140397DBEEE4AC9EF68B0D19&group_id=7319657865366176293&share_token=B90A230E-9578-4073-A91F-50D470B86BC9&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7320033361500717618/?app=news_article&timestamp=1711358811&use_new_style=1&req_id=202403251726518E0E94718F782C83A741&group_id=7320033361500717618&share_token=DF644EE2-102C-44AA-9990-108790D31887&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7320436157764944396/?app=news_article&timestamp=1711358840&use_new_style=1&req_id=2024032517272041D240A8DCAF65922DE9&group_id=7318560352986481179&share_token=0110D20A-4177-4A38-B1EE-087D8F281F64&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7337864825181504000/?app=news_article&timestamp=1711358436&use_new_style=1&req_id=2024032517203667988472206C0E77BC6E&group_id=7337864825181504000&share_token=8A831E88-0D00-4FE6-B053-4B383A77A572&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7331177781625766440/?app=news_article&timestamp=1711358537&use_new_style=1&req_id=20240325172216D25A69B5548F608D7E0C&group_id=7331177781625766440&share_token=80CD5551-D8EE-46FF-8D57-8AC98EC0EC6A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7328688639804949027/?app=news_article&timestamp=1711358658&use_new_style=1&req_id=202403251724172B3BC2CFD2F84C85C0EE&group_id=7328688639804949027&share_token=6D13C505-FD78-4103-9830-9A02315FA249&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7323146402148909607/?app=news_article&timestamp=1711358717&use_new_style=1&req_id=202403251725162B3BC2CFD2F84C85DF23&group_id=7323146402148909607&share_token=9887D6C6-C5AC-4DBF-9A28-E375ED0C46C1&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7321294860722536998/?app=news_article&timestamp=1711358766&use_new_style=1&req_id=202403251726068E0E94718F782C838F39&group_id=7321294860722536998&share_token=A14B8A7C-AF19-4F6D-9BDA-DC0B5FEF3802&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // "https://www.toutiao.com/article/7318560352986481179/?app=news_article&timestamp=1711358840&use_new_style=1&req_id=2024032517272041D240A8DCAF65922DE9&group_id=7318560352986481179&share_token=0110D20A-4177-4A38-B1EE-087D8F281F64&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // /** 硬笔楷书字体精讲50字 胡啸卿 - end */
];

// 行书
// const PATH_LIST = ["其他"];
// const IMAGES_DIR_PATH = `./images/行书/${PATH_LIST[0]}/`;
// const pageList = [
/**《岳阳楼记》行书入门教程 */
// "https://www.toutiao.com/article/7405178962831327759/?app=news_article&timestamp=1736582750&use_new_style=1&req_id=20250111160549B30CD7298D131FA1BF10&group_id=7405178962831327759&share_token=FE9C2D0F-1CEA-4DFD-B110-9F6F46A0F57E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
/** 陈国昭临白居易《长恨歌》 */
// "https://www.toutiao.com/article/7428417165923041833/?app=news_article&timestamp=1736581314&use_new_style=1&req_id=2025011115415446AA632135664A9DF481&group_id=7428417165923041833&share_token=FE35B364-DF1B-40CF-80FF-2ED2E4D7181E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
/** 陈国昭临柳宗元《始得西山宴游记》 */
// "https://www.toutiao.com/article/7437070435864379904/?app=news_article&timestamp=1736581286&use_new_style=1&req_id=20250111154126610152161A49C7BAF70E&group_id=7437070435864379904&share_token=A81BE7D9-9C65-48BD-B306-296CD878E336&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 珍藏版行书《千字文》 */
// "https://www.toutiao.com/article/7346605265384800818/?app=news_article&timestamp=1736250460&use_new_style=1&req_id=20250107194739F03224B606A9719F96A3&group_id=7346605265384800818&share_token=972FBAFE-FD81-4273-97D2-9E9771C4C20C&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 董其昌《陋室铭》 */
// "https://www.toutiao.com/article/7342887161207292442/?app=news_article&timestamp=1736250417&use_new_style=1&req_id=202501071946566B86E9523FAA229BF627&group_id=7342887161207292442&share_token=A3D4D50A-32C6-4EB4-B68A-3171796926C5&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 文征明《赤壁赋》 */
// "https://www.toutiao.com/article/7437703132726985235/?app=news_article&timestamp=1736250379&use_new_style=1&req_id=20250107194618BA2510F605A0D498FA49&group_id=7437703132726985235&share_token=3291393C-7400-4634-A0B5-B8A4D2FFD60D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 米芾行书字帖（附蜀素帖） */
// "https://www.toutiao.com/article/7452600159973786151/?app=news_article&timestamp=1736250369&use_new_style=1&req_id=202501071946081D10066401B61599717D&group_id=7452600159973786151&share_token=92F8AE44-FF36-41A7-9926-E87F54FEBC25&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 赵孟頫行书教程 */
// "https://www.toutiao.com/article/7434719429595857459/?app=news_article&timestamp=1736250339&use_new_style=1&req_id=202501071945394DF5C2E4E1E74A95617C&group_id=7434719429595857459&share_token=E7C31111-9B46-43DB-B7B9-13FBAEE0DE54&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 三字经简繁体毛笔字帖 */
// "https://www.toutiao.com/article/7375903921443832320/?app=news_article&timestamp=1728372775&use_new_style=1&req_id=20241008153254304825A498AB0C65D236&group_id=7375903921443832320&share_token=E70096B1-F4B6-40FB-B8F4-EC6D82ED4BD3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   //   /**《1185字行书字帖》- 胡问遂 */
// "https://www.toutiao.com/article/7411819957110981156/?app=news_article&timestamp=1728647173&use_new_style=1&req_id=20241011194613E6D27D0457537A40041F&group_id=7411819957110981156&share_token=E21F642F-DEE1-4F07-B163-79302275EE24&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

async function main(_IMAGES_DIR_PATH, _pageList, _pageTitle, _subFolder) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  let warnFlag = 0;

  for (let curPageIndex = 0; curPageIndex < _pageList.length; curPageIndex++) {
    await page.goto(_pageList[curPageIndex]);

    console.log("加载中...");

    await delay(_pageList.length > 10 ? 2500 : 5000);

    try {
      await page.click("#root .main .expand-button-wrapper .expand-button");

      await delay(1000);

      warnFlag = warnFlag + 1;
    } catch (e) {
      if (warnFlag < 3) {
        console.warn(`WARN: mock点击更多按钮失败 - ${_pageList[curPageIndex]}`);
      }
    }

    let __pageTitle = await page.evaluate(() => {
      const content1 = document.querySelector(
        "#root .main .article-content>h1"
      )?.textContent;

      if (!!content1) return content1;

      const content2 = document.querySelector(
        "#root .main .weitoutiao-html"
      )?.textContent;

      return content2;
    });

    const pageTitle = _pageTitle || __pageTitle;

    const images = await page.evaluate(() =>
      Array.from(
        (() => {
          const images1 = document.querySelectorAll(
            "#root .main article.tt-article-content .pgc-img"
          );

          if (!!images1.length) return images1;

          const images2 = document.querySelectorAll(
            "#root .main .image-list .weitoutiao-img"
          );

          return images2;
        })(),
        (el) => {
          const $img = el.querySelector("img") || el;
          return {
            src: $img.src,
            width: $img.getAttribute("img_width") || $img.width,
            height: $img.getAttribute("img_height") || $img.height,
          };
        }
      )
    );

    console.log(curPageIndex, pageTitle, images.length, "[images]");

    for (let i = 0; i < images.length; i++) {
      const result = await download(
        images[i].src,
        `${_IMAGES_DIR_PATH}/${pageTitle}/${_subFolder}/images`,
        `${padStart(curPageIndex)}${padStart(i)}x${images[i].width}x${
          images[i].height
        }.jpg`
      );

      if (result === true) {
        console.log(
          `Success: ${curPageIndex} ${i} ${images[i].src} has been downloaded successfully.`
        );
      } else {
        console.error(
          `Error: ${curPageIndex} ${i} ${images[i].src}  downloaded failed.`
        );
      }
    }
  }

  if (images.length > 0) {
    await delay(1000);
  }

  await browser.close();
}

// main(IMAGES_DIR_PATH, pageList, "", "").catch(console.error);

module.exports = {
  main: main,
};

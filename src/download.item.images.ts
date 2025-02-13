"use strict";

import puppeteer, { Page } from "puppeteer";
import { ItemSelectors, Config } from "@/interface/types";
import path from "path";

import { delay, downloadImage, padStart, saveImage } from "@/utils/tools";

import { scrollPageToBottom } from "@/utils";

// 篆书
// const CONFIG: Config = {
//   SCRIPT_TYPE: "篆书",
//   PATHS: ["吴昌硕"],
//   SOURCES: [
//     {
//       title: "吴昌硕石鼓文唐诗三首，月落乌啼",
//       url: "https://www.toutiao.com/article/7286833257789063716/?app=news_article&timestamp=1728369069&use_new_style=1&req_id=20241008143109DD7DEE2A90FCB08C63C8&group_id=7286833257789063716&share_token=8490C45F-F311-41AC-A664-96F5E9D4EE8E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//     },
// {
//   title: "《吴昌硕篆书部首一百法》书法教程",
//   url: "https://www.toutiao.com/article/7193704965666357772/?app=news_article&timestamp=1728527968&use_new_style=1&req_id=20241010103928F8AAE3714C299C66A992&group_id=7193704965666357772&share_token=B82A1348-6956-4397-99EE-1727367B4B6A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "吴昌硕篆书《西泠印社记》",
//   url: "https://www.toutiao.com/article/7369882042505200167/?app=news_article&timestamp=1728540084&use_new_style=1&req_id=202410101401240F9ED9C32A53AE7EFDF9&group_id=7369882042505200167&share_token=0A484FFE-7C96-4C35-AE99-8E963957DEAA&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "清吴昌硕篆书修震泽许塘记墨迹本",
//   url: "https://www.toutiao.com/article/7358739612464103972/?app=news_article&timestamp=1728548210&use_new_style=1&req_id=2024101016164900814CB4CE02228E4F9A&group_id=7358739612464103972&share_token=D3581190-B6E3-4DF9-A81F-34BE91061AEA&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
//   ],
// };

// 隶书
// const CONFIG: Config = {
//   SCRIPT_TYPE: "隶书",
//   PATHS: ["曹全碑"],
//   SOURCES: [
//     {
//       title: "《曹全碑》书法集字春联（附横批）",
//       url: "https://www.toutiao.com/article/7055524026327892519/?app=news_article&timestamp=1730721446&use_new_style=1&req_id=20241104195725B2AB70EBAD8598156497&group_id=7055524026327892519&share_token=3ABAAC2A-1DF9-4E4C-8753-C4B8108B8226&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//     },
// {
//   title: "《曹全碑》《张迁碑》《史晨碑》集字联（附横批）",
//   url: "https://www.toutiao.com/article/6911926339956146700/?app=news_article&timestamp=1730701711&use_new_style=1&req_id=20241104142831DCD2EB04BC38CB2E2FF3&group_id=6911926339956146700&share_token=879BE962-3902-4061-B382-65C8BB09B345&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《曹全碑》隶书集字春联1",
//   url: "https://www.toutiao.com/article/7049859859604423209/?app=news_article&timestamp=1730701663&use_new_style=1&req_id=202411041427421616B5290E7D1629A89A&group_id=7049859859604423209&share_token=3A8291F8-1E75-47BD-B4AE-AA9E519BDC34&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《曹全碑》隶书集字春联2",
//   url: "https://www.toutiao.com/article/7188848139930780217/?app=news_article&timestamp=1730701622&use_new_style=1&req_id=20241104142702AF7A0A527F46002D6C20&group_id=7188848139930780217&share_token=C7D6B5DF-3315-4746-8CD0-66ECF0E82D50&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《曹全碑》隶书集字春联3",
//   url: "https://www.toutiao.com/article/7314808679163855395/?app=news_article&timestamp=1730701521&use_new_style=1&req_id=202411041425212D5CE7F4B5133F2C0FF4&group_id=7314808679163855395&share_token=8D78DC5A-8551-494A-9035-9CFE8A669206&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《曹全碑》隶书集字春联4",
//   url: "https://www.toutiao.com/w/1811667846548491/?app=news_article&timestamp=1730701789&use_new_style=1&share_token=C7075C9A-4183-4557-80AC-9EB0A4A6CBA6&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《曹全碑》集字锦言30幅欣赏",
//   url: "https://www.toutiao.com/article/7368703686865879578/?app=news_article&timestamp=1716869415&use_new_style=1&req_id=2024052812101482EFA173C0A154689890&group_id=7368703686865879578&share_token=068C3F3C-40DC-4A87-90EA-43F0FFBC1F4C&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《曹全碑》集字书法作品赏析",
//   url: "https://www.toutiao.com/article/7362574373963825690/?app=news_article&timestamp=1716869716&use_new_style=1&req_id=20240528121515237CB7F6795AA66B2D1C&group_id=7362574373963825690&share_token=1BE62534-22D1-44BA-A4F2-44B0CA1D71E8&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "曹全碑标准字帖，本帖共57页，共684字，喜欢隶书的收藏好了",
//   url: "https://www.toutiao.com/article/7338812422226117172/?app=news_article&timestamp=1727148611&use_new_style=1&req_id=2024092411301100B961EAE2EBB47B88DD&group_id=7338812422226117172&share_token=96DFCA5A-0D8D-4B21-8AE9-E687095017E3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
//   ],
// };

// 楷书
const CONFIG: Config = {
  SCRIPT_TYPE: "楷书",
  // PATHS: ["软笔", "颜体"],
  // SOURCES: [
  //   //     {
  //   //       title: "颜柳楷书对照字帖",
  //   //       url: "https://www.toutiao.com/article/7421903462453002806/?app=news_article&timestamp=1736584181&use_new_style=1&req_id=202501111629402BF4B8DA19A73BB4ABED&group_id=7421903462453002806&share_token=7AFDD4D5-F90E-4B88-8B88-E81799D734B2&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   //     },
  //   //     {
  //   //       title: "《多宝塔碑》宋拓版",
  //   //       url: "https://www.toutiao.com/article/7395464831031869987/?app=news_article&timestamp=1736309891&use_new_style=1&req_id=20250108121810C8DD41DE89C97AED6488&group_id=7395464831031869987&share_token=79BC1C4E-AC84-4863-8461-B820167B4A5F&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   //     },
  //   // {
  //   //   title: "《多宝塔碑》集字·唐诗2",
  //   //   url: "https://www.toutiao.com/article/6821505002733830663/?app=news_article&timestamp=1736310357&use_new_style=1&req_id=202501081225578F4782C4FB1E82EF336D&group_id=6821505002733830663&share_token=12CB648F-523E-4524-A135-148105A2E75D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》集字·唐诗",
  //   //   url: "https://www.toutiao.com/article/7403546057780773413/?app=news_article&timestamp=1736309862&use_new_style=1&req_id=202501081217413E4DC3DD53FE0AF16401&group_id=7403546057780773413&share_token=94A9552C-316A-4808-A2AC-D6CFE8DA3A6F&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》集字八言|九言联",
  //   //   url: "https://www.toutiao.com/article/7251936516585570816/?app=news_article&timestamp=1736309846&use_new_style=1&req_id=20250108121725225ABFE0877065ED7839&group_id=7251936516585570816&share_token=6E301021-E32E-47EC-B216-389DCCD721E2&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》集字楹联一",
  //   //   url: "https://www.toutiao.com/w/1806506595988556/?app=news_article&timestamp=1736309807&use_new_style=1&share_token=76A1C63E-3F18-4E93-82D4-F260FBA4E917&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》集字楹联二",
  //   //   url: "https://www.toutiao.com/w/1798984811507785/?app=news_article&timestamp=1736309824&use_new_style=1&share_token=63BA2BA2-2ACA-42FF-B989-29DF223C12F7&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《大唐中兴颂》楷书",
  //   //   url: "https://www.toutiao.com/article/7454718393296437769/?app=news_article&timestamp=1736249696&use_new_style=1&req_id=202501071934553B2342207072439655D0&group_id=7454718393296437769&share_token=91F52EFF-C30E-44E5-9AAC-9D3D243AAD84&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》唐诗集字",
  //   //   url: "https://www.toutiao.com/article/7449766687454380553/?app=news_article&timestamp=1736249358&use_new_style=1&req_id=20250107192917C715A612C7F2299AD9C3&group_id=7449766687454380553&share_token=90C09AF2-6B37-4732-BCD2-D57DD956D506&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "颜体集字春联，欢喜登场",
  //   //   url: "https://www.toutiao.com/article/7051940129799176716/?app=news_article&timestamp=1736050492&use_new_style=1&req_id=202501051214515C7CA4C8B80C6CC6A389&group_id=7051940129799176716&share_token=83C06FE2-21E7-4C41-8597-E09880A2DC0D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "颜真卿楷书春联集字（有横批）",
  //   //   url: "https://www.toutiao.com/article/7451502946392556042/?app=news_article&timestamp=1736050838&use_new_style=1&req_id=20250105122037CD45C8EAEDE30D86C4DE&group_id=7451502946392556042&share_token=6CB07A40-3CB5-449A-9612-A6FB7EB6F87A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》集字古诗",
  //   //   url: "https://www.toutiao.com/w/1812668096050176/?app=news_article&timestamp=1735371567&use_new_style=1&share_token=A0ECB470-9386-422A-93EC-9F5C3585F51B&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《裴将军诗帖》杨再春临",
  //   //   url: "https://www.toutiao.com/article/7418982414766113289/?app=news_article&timestamp=1735368496&use_new_style=1&req_id=20241228144816ECC7A648F2C11173DEBB&group_id=7418982414766113289&share_token=DEC847A5-2437-489F-A5E0-89D7F7B785F9&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《自书告身帖》楷书",
  //   //   url: "https://www.toutiao.com/article/7449207966806311433/?app=news_article&timestamp=1735362563&use_new_style=1&req_id=2024122813092361A806484D9A527017FB&group_id=7449207966806311433&share_token=EEA14111-8A41-44E9-B521-C0D5FC79EE73&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《自书告身帖》楷书-单字米格放大版",
  //   //   url: "https://www.toutiao.com/article/7443476823919100443/?app=news_article&timestamp=1739430712&use_new_style=1&req_id=20250213151152ABDE28B6E96FFAB53B8D&group_id=7443476823919100443&req_id_new=20250213151152ABDE28B6E96FFAB53B8D&chn_id=-3&category_new=my_favorites_all&share_did=MS4wLjACAAAA4788UarqDKGwwQQNu_dmn3wv5odoefkCSSUi_-I3ItoJuTwRyoy86gphxHcdVOyb&share_uid=MS4wLjABAAAA9mI8aIpMIgfT0qt0bCaFiD6-aYDFaUO0iOfH7EJdeJo&share_token=EA3A91D1-5345-424D-8B39-48246C1B32AB&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》标准字帖",
  //   //   url: "https://www.toutiao.com/article/7338808433564582435/?app=news_article&timestamp=1735212527&use_new_style=1&req_id=20241226192846433DFC0657DC1C91DD1F&group_id=7338808433564582435&share_token=33EB50BA-CC5E-4130-A4F9-F150A1425ADD&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《颜勤礼碑》集字春联（新版）",
  //   //   url: "https://www.toutiao.com/article/7338015443498500617/?app=news_article&timestamp=1734346850&use_new_style=1&req_id=20241216190049F3528BF746F07F9662A0&group_id=7338015443498500617&share_token=3ADF9B94-17B0-4EF2-BA4B-A29FCD60E8EB&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《颜勤礼碑》楷书字帖",
  //   //   url: "https://www.toutiao.com/article/6849242895333982732/?app=news_article&timestamp=1735375665&use_new_style=1&req_id=202412281647443DACE18BD95111846C32&group_id=6849242895333982732&share_token=E77E3F98-AF91-443B-BCAF-0089D1F9B58D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《颜勤礼碑》集字春联",
  //   //   url: "https://www.toutiao.com/w/1816476393011292/?app=news_article&timestamp=1734346991&use_new_style=1&share_token=D5523BBD-D2A2-4241-8229-5E8AA5791523&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《多宝塔碑》集字春联",
  //   //   url: "https://www.toutiao.com/article/7444128088637604404/?app=news_article&timestamp=1734346547&use_new_style=1&req_id=2024121618554771A5378AA4775A884A3B&group_id=7444128088637604404&share_token=BAC40DB4-5F32-4D80-A5B6-543CD697862A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  //   // {
  //   //   title: "《颜勤礼碑》集字：沁园春雪",
  //   //   url: "https://www.toutiao.com/article/7380666467278193186/?app=news_article&timestamp=1727166300&use_new_style=1&req_id=202409241624597085FAE47F56F5A84D98&group_id=7380666467278193186&share_token=ADD80C5E-03E4-4FEF-A75C-814AAAA7FC55&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  //   // },
  // ],
  PATHS: ["软笔", "其他", "梁同书"],
  SOURCES: [
    // {
    //   title: "清代梁同书楷书《千字文》",
    //   url: "https://www.toutiao.com/article/7100920434492850726/?app=news_article&timestamp=1739852847&use_new_style=1&req_id=20250218122726F4DAE2D08B0CAA1F46E6&group_id=7100920434492850726&req_id_new=20250218122726F4DAE2D08B0CAA1F46E6&chn_id=-3&category_new=my_favorites_all&share_did=MS4wLjACAAAA4788UarqDKGwwQQNu_dmn3wv5odoefkCSSUi_-I3ItoJuTwRyoy86gphxHcdVOyb&share_uid=MS4wLjABAAAA9mI8aIpMIgfT0qt0bCaFiD6-aYDFaUO0iOfH7EJdeJo&share_token=67710324-F4BD-4187-B063-D1BDB50AD942&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
    // },
    {
      title: "清代梁同书楷书作品《六一泉三堂祠记》",
      url: "https://www.toutiao.com/article/7472375223346676250/?app=news_article&timestamp=1739852835&use_new_style=1&req_id=20250218122714C0E14B04DEAD90FBF506&group_id=7472375223346676250&req_id_new=20250218122714C0E14B04DEAD90FBF506&chn_id=-3&category_new=my_favorites_all&share_did=MS4wLjACAAAA4788UarqDKGwwQQNu_dmn3wv5odoefkCSSUi_-I3ItoJuTwRyoy86gphxHcdVOyb&share_uid=MS4wLjABAAAA9mI8aIpMIgfT0qt0bCaFiD6-aYDFaUO0iOfH7EJdeJo&share_token=91777CED-6758-4954-904F-B98DD377E9F0&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
    },
  ],
};

// 行书
// const CONFIG: Config = {
//   SCRIPT_TYPE: "行书",
//   PATHS: ["米芾"],
//   SOURCES: [
// {
//   title: "《岳阳楼记》行书入门教程",
//   url: "https://www.toutiao.com/article/7405178962831327759/?app=news_article&timestamp=1736582750&use_new_style=1&req_id=20250111160549B30CD7298D131FA1BF10&group_id=7405178962831327759&share_token=FE9C2D0F-1CEA-4DFD-B110-9F6F46A0F57E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "陈国昭临白居易《长恨歌》",
//   url: "https://www.toutiao.com/article/7428417165923041833/?app=news_article&timestamp=1736581314&use_new_style=1&req_id=2025011115415446AA632135664A9DF481&group_id=7428417165923041833&share_token=FE35B364-DF1B-40CF-80FF-2ED2E4D7181E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "陈国昭临柳宗元《始得西山宴游记》",
//   url: "https://www.toutiao.com/article/7437070435864379904/?app=news_article&timestamp=1736581286&use_new_style=1&req_id=20250111154126610152161A49C7BAF70E&group_id=7437070435864379904&share_token=A81BE7D9-9C65-48BD-B306-296CD878E336&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "珍藏版行书《千字文》",
//   url: "https://www.toutiao.com/article/7346605265384800818/?app=news_article&timestamp=1736250460&use_new_style=1&req_id=20250107194739F03224B606A9719F96A3&group_id=7346605265384800818&share_token=972FBAFE-FD81-4273-97D2-9E9771C4C20C&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "董其昌《陋室铭》",
//   url: "https://www.toutiao.com/article/7342887161207292442/?app=news_article&timestamp=1736250417&use_new_style=1&req_id=202501071946566B86E9523FAA229BF627&group_id=7342887161207292442&share_token=A3D4D50A-32C6-4EB4-B68A-3171796926C5&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "文征明《赤壁赋》",
//   url: "https://www.toutiao.com/article/7437703132726985235/?app=news_article&timestamp=1736250379&use_new_style=1&req_id=20250107194618BA2510F605A0D498FA49&group_id=7437703132726985235&share_token=3291393C-7400-4634-A0B5-B8A4D2FFD60D&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "米芾行书字帖（附蜀素帖）",
//   url: "https://www.toutiao.com/article/7452600159973786151/?app=news_article&timestamp=1736250369&use_new_style=1&req_id=202501071946081D10066401B61599717D&group_id=7452600159973786151&share_token=92F8AE44-FF36-41A7-9926-E87F54FEBC25&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "赵孟頫行书教程",
//   url: "https://www.toutiao.com/article/7434719429595857459/?app=news_article&timestamp=1736250339&use_new_style=1&req_id=202501071945394DF5C2E4E1E74A95617C&group_id=7434719429595857459&share_token=E7C31111-9B46-43DB-B7B9-13FBAEE0DE54&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "三字经简繁体毛笔字帖",
//   url: "https://www.toutiao.com/article/7375903921443832320/?app=news_article&timestamp=1728372775&use_new_style=1&req_id=20241008153254304825A498AB0C65D236&group_id=7375903921443832320&share_token=E70096B1-F4B6-40FB-B8F4-EC6D82ED4BD3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
// {
//   title: "《1185字行书字帖》- 胡问遂",
//   url: "https://www.toutiao.com/article/7411819957110981156/?app=news_article&timestamp=1728647173&use_new_style=1&req_id=20241011194613E6D27D0457537A40041F&group_id=7411819957110981156&share_token=E21F642F-DEE1-4F07-B163-79302275EE24&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// },
//   ],
// };

// Constants with clearer names
const DELAY_TIME = {
  SHORT: 5000,
  LONG: 10000,
};

const SELECTORS: ItemSelectors = {
  EXPAND_BUTTON: "#root .main .expand-button-wrapper .expand-button",
  TITLE: {
    PRIMARY: "#root .main .article-content>h1",
    SECONDARY: "#root .main .weitoutiao-html",
  },
  IMAGES: {
    PRIMARY: "#root .main article.tt-article-content .pgc-img",
    SECONDARY: "#root .main .image-list .weitoutiao-img",
  },
};

async function getPageImages(
  page: Page
): Promise<{ url: string; width: number; height: number }[]> {
  return await page.evaluate((selectors) => {
    const primaryImages = document.querySelectorAll(selectors.IMAGES.PRIMARY);
    const images = primaryImages.length
      ? primaryImages
      : document.querySelectorAll(selectors.IMAGES.SECONDARY);

    return Array.from(images || [], (el) => {
      const $img = el.querySelector("img") || (el as HTMLImageElement);

      return {
        url: $img.getAttribute("data-src") || $img.src,
        width: ($img.getAttribute("img_width") ||
          $img.naturalWidth ||
          $img.width) as number,
        height: ($img.getAttribute("img_height") ||
          $img.naturalHeight ||
          $img.height) as number,
      };
    }).filter(Boolean);
  }, SELECTORS);
}

async function processPage(
  page: Page,
  source: Config["SOURCES"][0],
  curPageIndex: number,
  outputPath: string,
  subFolder: string
): Promise<void> {
  try {
    await page.goto(source.url);
    console.log("Loading page...");

    await delay(DELAY_TIME.LONG);

    try {
      await page.click(SELECTORS.EXPAND_BUTTON);
      await delay(1000);
    } catch (e) {
      console.warn(`Warning: Failed to click expand button - ${source.url}`);
    }

    const lastPosition = await scrollPageToBottom(page, {
      size: 800,
      delay: 250,
    });

    console.log(lastPosition, "[lastPosition]");

    const pageTitle = source.title;
    const images = await getPageImages(page);

    console.log(`Processing: ${pageTitle} - Found ${images.length} images`);

    const imagePath = path.join(outputPath, pageTitle, subFolder, "images");

    console.log(imagePath, "imagePath");

    for (const [index, image] of images.entries()) {
      try {
        const imageData = await downloadImage(image.url);

        const imageName = `${padStart(curPageIndex.toString())}_${padStart(
          index.toString()
        )}x${image.width}x${image.height}.jpg`;

        await saveImage(imagePath, imageName, imageData);

        // await downloadAndSaveImage(imageUrl, imagePath, `image_${index}.jpg`);
      } catch (error) {
        console.error(`Failed to download image ${index}: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Failed to process page ${source.url}: ${error}`);
  }
}

async function main(
  outputPath: string,
  sources: Config["SOURCES"],
  subFolder: string = ""
): Promise<void> {
  const browser = await puppeteer.launch({ headless: false });

  try {
    const page = await browser.newPage();

    // Custom user agent
    const customUA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";
    // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'

    // Set custom user agent
    await page.setUserAgent(customUA);

    for (const [curPageIndex, source] of sources.entries()) {
      await processPage(page, source, curPageIndex, outputPath, subFolder);
    }
  } catch (error) {
    console.error("Main process failed:", error);
  } finally {
    await browser.close();
  }
}

const DOCS_PATH = path.join("images", CONFIG.SCRIPT_TYPE, ...CONFIG.PATHS);

main(DOCS_PATH, CONFIG.SOURCES, "").catch(console.error);

export { main };

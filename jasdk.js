/**
 * copyright Just.As 2018
 * yooibox@gmail.com
 * this SDK developed by http://Just.As 
 * Author: Yooi / GPL
 */
var JA = {
	sdk:{},
	rest:{},
	net:{},
	config:{
		appkey:"1567453627",
		access_token:""
	},
	verion:2112
};
JA.net = function(){
	var a = {};
	a.get = function(url, args, successCallback, completeCallback){
		return $.ajax({
			url: url,
			method: "get",
			data: args,
			dataType: "json",
			beforeSend:function(xhr) {
				a.prepareHeaders(xhr,url);
		    },
			error: __httpErrorCallback,
			success: successCallback,
			complete: completeCallback
		});
	};
	a.post = function(url, args, successCallback, completeCallback){
		return $.ajax({
			url: url,
			method: "post",
			data: args,
			dataType: "json",
			beforeSend:function(xhr) {
				a.prepareHeaders(xhr,url);
		    },
			error: __httpErrorCallback,
			success: successCallback,
			complete: completeCallback
		});
	};
	a.prepareHeaders = function(xhr, url){
		if(url.indexOf("m.weibo.cn")!=-1||url.indexOf("__ref")!=-1){
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		if(url.indexOf("m.weibo.cn")!=-1&&typeof __st!="undefined"){
			xhr.setRequestHeader("X-XSRF-TOKEN", __st);
		}else if(url.indexOf("weibo.com")!=-1&&typeof __xsrf!="undefined"){
			xhr.setRequestHeader("X-XSRF-TOKEN", __xsrf);
		}
	};
	__httpErrorCallback = function(xhr, textStatus, errorThrown){
		if(xhr.status != 200){
			if(typeof alertmessages != "undefined"){
				if(xhr.status == 414){
					alertmessages("请求错误: 删除频率太高，微博服务已经停止响应，请等2分钟后再试！",60000);
				}else if(xhr.status == 418){
					alertmessages("请求错误: 微博ERROR 418！请求次数超过微博服务限制被屏蔽，请换时间再试!",60000);
				}else if(xhr.status == 302){
					alertmessages("系统提示：授权超时，请刷新软件或重新登陆微博账号！",60000);
				}else if(xhr.status == 0){
					alertmessages("请求错误: Code 0 请求被本地网络阻止!请调整/更换网络节点或者热点",60000);
				}else{
					alertmessages("请求错误: 微博返回 Http Code ["+ xhr.status+"]["+xhr.readyState+"]",60000);
				}
			}else{
				alertmessages("微博请求错误: Http Code ["+ xhr.status+"]["+xhr.readyState+"]", 60000);
			}
		}
	};
	return a;
}();
JA.rest = function(){
	var wb = {};
	wb.friendships_friends = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getSecond", 
			{containerid: "100505"+uid+"_-_FOLLOWERS", page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_friends_v2 = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/ajax/profile/followContent?__ref", 
			{sortType: "all", page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_followers = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getSecond", 
			{containerid: "100505"+uid+"_-_FANS", page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_followersv2 = function(uid, page, oCallback, errCallback){
		args = {containerid: "100505"+uid+"_-_FANS", page:page}
		return xgj.ajaxGet("https://m.weibo.cn/api/container/getSecond?containerid="+"100505"+uid+"_-_FANS&page="+page, function(sResult){
			sResult = JSON.parse(sResult);
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_followers_v3 = function(uid, page, oCallback, errCallback){
		let args = {uid: uid, page:page, relate:"fans", type:"fans", fansSortType:"followTime"}
		return JA.net.get("https://www.weibo.com/ajax/friendships/friends?__ref", args, function(sResult){
			sResult = JSON.parse(sResult);
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};	
	wb.friends_timeline = function(next_cursor, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/feed/friends", 
			{max_id:next_cursor}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});		
	};
	wb.friendships_newfollowers = function(count, since_id, oCallback, errCallback){
		/* login required */
		return JA.net.get("https://m.weibo.cn/api/container/getIndex?containerid=10320310&page_type=3&lfid=103103", 
			{count:count||20, since_id:since_id}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.friends_info = function(uid, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/feed/friends", 
			{max_id:next_cursor}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});		
	};
	wb.statuses_likes_v2 = function(uid, page, pagebar, oCallback, errCallback){
		// https://weibo.com/aj/like/list?ajwvr=6&pre_page=1&page=1&leftnav=1&pagebar=0
		// 
		return JA.net.get("https://www.weibo.com/p/aj/v6/mblog/mbloglist?ajwvr=6&domain=100505&from=home&wvr=6&pl_name=Pl_Core_LikesFeedV6__68&tab=like&feed_type=2&domain_op=100505", 
			{id: "100505"+uid, page:page, pre_page:page, pagebar:0}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.m_statuses_likes = function(next_cursor, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/likes/byme", 
			{max_id:next_cursor}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.m_statuses_likes_v2 = function(page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid:"230869"+uid+"_-_mix", page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_likes = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getSecond", 
			{containerid: "100505"+uid+"_-_WEIBO_SECOND_PROFILE_LIKE_WEIBO", page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.favorites = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid: "230259"+uid, page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.favorites_v2 = function(page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex?openApp=0", 
			{containerid: "230259", page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_create = function(uid, oid, nick, oCallback, errCallback){
		//target uid, self oid
		return JA.net.post("https://www.weibo.com/aj/f/followed?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
				{uid:uid, objectid:"", f:0, extra:"", location:"friends_dynamic",oid:oid, wforce:1, nogroup:1, template:2, _t:0, fnick:nick, third_appkey_alias:"attfeed"}, 
				function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_destroy = function(uid, nick, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/f/unfollow?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
				{uid:uid, screen_name:nick, refer_flag:"unfollow", _t:0}, function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};
	wb.friendships_followers_destroy = function(uid, nick, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/f/remove?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{uid:uid, nick:nick, _t:0}, function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};	
	wb.statuses_destroy = function(mid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/mblog/del?__ref&ajwvr=6", {mid:mid}, function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_destroy_v2 = function(mid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/ajax/statuses/destroy?__ref", {id:mid}, function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});
	};
	wb.m_statuses_destroy = function(mid, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/mblogDeal/delMyMblog", {id:mid, st:__st}, function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});		
	};
	wb.m_friendships_destroy = function(uid, nick, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/api/friendships/destory", {uid:uid, st:__st}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.m_friendships_followers_destroy = function(uid, nick, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/f/remove?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{uid:uid, st:__st}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_update = function(text, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/mblog/add?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
				{text:text, style_type:1, location:"v6_content_home", rank:0, _t:0}, function(sResult){
			__restCallbackHandler(0, text, sResult, oCallback, errCallback);
		});	
	};
	//direct send
	wb.statuses_update_v2 = function(text, mediaObj, oid, sync_mblog, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/ajax/statuses/update", 
			{content:text, pic_id:mediaObj.pic_id||"", visible:0, share_id:"", media:mediaObj.media||"{}", vote:"{}", 
			topic_id:oid||"", sync_mblog:sync_mblog||1, approval_state:0},
			function(sResult){
			__restCallbackHandler(1, oid, sResult, oCallback, errCallback);
		});
	};
	wb.video_status_update = function(text, time, videoObj, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/mblog/add?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{location:"v6_content_home", text:text, style_type:1, appkey:"", pic_id:"", pdetail:"", tid:"", mid:"", isReEdit:false,
			video_fid:videoObj.fid, video_titles:videoObj.title, cover_source:11, video_covers:videoObj.cover, key:videoObj.key||0, 
			desc_second:videoObj.desc_second, channel_id:videoObj.channel_id, desc_first:videoObj.desc_first, sub_channel_id:videoObj.sub_channel_id,
			supported_video_type:"0,1,2,3", channel_ids:videoObj.sub_channel_id, channel_tags:videoObj.channel_tags, channel_tags_info:videoObj.channel_tags_info,
			contribution_type:videoObj.contribution_type, video_source:videoObj.video_source, video_watermark:1, video_monitor:1, album_ids:videoObj.album_ids, rank:0, rankid:"", module:"stissue", pub_source:"main_",pub_type:"dialog",
			addtime:time, isPri:0, _t:0},
			function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.video_playlists = function(page, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/aj/video/getuserplaylists?ajwvr=6&__rnd="+new Date().getTime(),
			{page:page},function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.video_detail = function(oid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/tv/api/component?page=/tv/show/"+oid, 
				{data:'{"Component_Play_Playinfo":{"oid":"'+oid+'"}}'}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.time_status_destroy = function(id, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/mblog/deltime?__ref&ajwvr=6", 
				{timeweibo:1, id:id, addtime:new Date().getTime()}, function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	wb.time_status_update = function(uid, text, pic_id, time, oCallback, errCallback){
		updata_img_num = pic_id != null?pic_id.split("|").length:0;
		return JA.net.post("https://www.weibo.com/aj/mblog/add?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{location:"page_100505_manage", text:text, style_type:1, pic_id:pic_id||"", pdetail:"100505"+uid, rank:0, addtime:time, updata_img_num:updata_img_num, pub_type:"dialog",_t:0},
			function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};	
	wb.time_status = function(status, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/p/aj/timeweibo/select?__ref&ajwvr=6&order=mtime&__rnd="+new Date().getTime(),
			{status:status},function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.time_status_v2 = function(type, oCallback, errCallback) {
		//type 0 success, 1 failure
		return JA.net.get("https://www.weibo.com/ajax/statuses/schedule/list?__ref&max_id=",
			{type:0},function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	}
	wb.m_statuses_super = function(uid, since_id, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid: "100803_-_followsuper", luicode:10000011, lfid:"231093_-_chaohua", since_id:since_id||'{"manage":"","follow":"","page":1}'}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.super_status_update = function(oid, text, pic_id, oCallback, errCallback){
		//donot support timer
		updata_img_num = pic_id != null?pic_id.split("|").length:0;
		return JA.net.post("https://www.weibo.com/p/aj/proxy?ajwvr=6&__rnd="+new Date().getTime(), 
			{location:"page_100808_super_index", text:text, style_type:1, pic_id:pic_id||"", pdetail:"100808"+oid, 
			rank:0, updata_img_num:updata_img_num, pub_type:"dialog",_t:0, sync_wb:1, isReEdit:false, 
			pub_source:"page_1", api:"http://i.huati.weibo.com/pcpage/operation/publisher/sendcontent?sign=super&page_id=100808"+oid,
			object_id:"1022:100808"+oid, module:"publish_913", page_module_id:913, topic_id:"1022:100808"+oid, longtext:1},
			function(sResult){
			__restCallbackHandler(0, oid, sResult, oCallback, errCallback);
		});
	};
	wb.time_status_update_v2 = function(text, mediaObj, timestamp, oid, sync_mblog, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/ajax/statuses/schedule/upload", 
			{content:text, pic_id:mediaObj.pic_id||"", visible:0, share_id:"", media:mediaObj.media||"{}", vote:"{}", 
			topic_id:oid||"", schedule_timestamp:timestamp, schedule_id:"",	sync_mblog:sync_mblog||1, approval_state:0},
			function(sResult){
			__restCallbackHandler(1, oid, sResult, oCallback, errCallback);
		});
	};
	wb.super_follow = function(uid, oid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/p/aj/proxy?ajwvr=6&__rnd="+new Date().getTime(), 
			{location:"page_100808_super_index", uid:uid, oid:oid, wforce:1, nogroup:1, fnick:"", template:4, isinterest:true,
			pageid:"100808"+oid,f:1, api:"http://i.huati.weibo.com/aj/superfollow",extra:"",refer_sort:"",refer_flag:"",
			objectid:"1022:100808"+oid, reload:1},
			function(sResult){
			__restCallbackHandler(0, oid, sResult, oCallback, errCallback);
		});
	};
	wb.super_unfollow = function(uid, oid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/p/aj/relation/unfollow?ajwvr=6", 
			{location:"page_100808_super_index", uid:uid, oid:oid, wforce:1, nogroup:1, fnick:"", template:4, isinterest:true,
			pageid:"100808"+oid,f:1, api:"http://i.huati.weibo.com/aj/superfollow",extra:"",refer_sort:"",refer_flag:"",
			objectid:"1022:100808"+oid, reload:1},
			function(sResult){
			__restCallbackHandler(0, oid, sResult, oCallback, errCallback);
		});
	};
	wb.super_search = function(name, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/aj/v6/topic/search?ajwvr=6&__rnd="+new Date().getTime(),
			{type:"topic",is_search:1,query:name},function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.super_checkin = function(id, ua, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/p/aj/general/button?ajwvr=6&__rnd="+new Date().getTime(),
			{api:"http://i.huati.weibo.com/aj/super/checkin",texta:"签到",textb:"已签到",status:0,id:"100808"+id,
			location:"page_100808_super_index",timezone:"GMT 0800",lang:"zh-cn",plat:"Win32",ua:ua,screen:"0x0"},function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	//get article id
	wb.article_create = function(uid, oCallback, errCallback) {
		return JA.net.post("https://card.weibo.com/article/v3/aj/editor/draft/create?__ref&uid="+uid, {},
			function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};
	//2nd save draft
	wb.article_save = function(id, uid, articleObj, oCallback, errCallback) {
		return JA.net.post("https://card.weibo.com/article/v3/aj/editor/draft/save?__ref&uid="+uid+"&id="+id, 
			{id:id, title:articleObj.title, updated:articleObj.updated, subtitle:articleObj.subtitle||"", type:articleObj.type||"",
			status:0, is_article_free:0, publish_at:"", error_msg:"", error_code:0, collection:"[]", free_content:"",
			content:articleObj.content, cover:articleObj.cover, summary:articleObj.summary, writer:articleObj.writer||"", extra:"[]",
			is_word:0, article_recommend:"[]", is_v4:1, follow_to_read:0, "follow_to_read_detail[result]":1, 
			"follow_to_read_detail[x]":0, "follow_to_read_detail[y]":0, "follow_to_read_detail[readme_link]":"http://t.cn/A6UnJsqW",
			"follow_to_read_detail[level]":"D", isreward:0, isreward_tips:"", isreward_tips_url:"https://card.weibo.com/article/v3/aj/editor/draft/applyisrewardtips?uid"+uid,
			"pay_setting":"[]", source:0, action:1, content_type:0, save:1, ver:"4.0"},
			function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	//3rd publish
	wb.article_publish = function(id, uid, text, time, oCallback, errCallback) {
		let args = {id:id, rank:0, text:text, follow_official:0, sync_wb:0, is_original:0, time:time||"", support_all_tag:1, ver:"4.0"};
		let publish_url = "https://card.weibo.com/article/v3/aj/editor/draft/publish?__ref&uid="+uid+"&id="+id;
		if(time){
			publish_url = "https://card.weibo.com/article/v3/aj/editor/draft/publishtiming?__ref&uid="+uid+"&id="+id;
		}
		return JA.net.post(publish_url, args, function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	wb.shop_product_list = function(page, oCallback, errCallback){
		return JA.net.get("https://shop.sc.weibo.com/admin/aj/product/list?__ref",
			{type:2,page:page,num:10},function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.daogou_product_list = function(page, oCallback, errCallback, completeCallback){
		return JA.net.get("https://daogou.sc.weibo.com/aj/item/list",
			{page:page,page_size:20}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		}, completeCallback);
	};
	wb.daogou_product_pics = function(item_ids, oCallback, errCallback){
		return JA.net.post("https://daogou.sc.weibo.com/aj/content/multiPic?_="+new Date().getTime(),
			{item_ids:item_ids}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.uploadimage = function(){

	};
	wb.direct_message = function(uid, content, fid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/message/add?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{location:"msgdialog", module:"msgissue", style_id:1, text:content, tovfids:fid||"", fids:fid||"", uid:uid, _t:0}, function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};
	wb.m_direct_message = function(uid, content, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/msgDeal/sendMsg", 
			{fileId:null, uid:uid, content:content, st:__st}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.m_chat_send = function(uid, content, fid, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/api/chat/send", 
			{fids:fid||null, uid:uid, content:content, st:__st, _spr:"screen:0x0"}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.m_group_send = function(gid, content, fid, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/api/groupchat/send", 
			{fids:fid||null, gid:gid, content:content, st:__st, _spr:"screen:0x0"}, function(sResult){
			__restCallbackHandler(1, gid, sResult, oCallback, errCallback);
		});
	};
	/*
	wb.message_timeline = function(page, oCallback, errCallback){
		
		return JA.net.get("https://m.weibo.cn/msg/noteList", 
			{page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.dm_message_timeline = function(page, oCallback, errCallback){
		
		return JA.net.get("https://m.weibo.cn/msg/index?format=cards", 
			{page:page}, function(sResult){
				sResult = sResult[0]; sResult.ok = 1;
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};*/
	wb.user_messages = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/msg/messages", 
			{uid:uid, page:page}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});		
	},
	wb.user_chats = function(uid, count, unfollowing, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/chat/list", 
			{uid:uid, count:count, unfollowing:unfollowing}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});		
	},
	wb.group_chats = function(gid, count, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/groupchat/list", 
			{gid:gid, count:count}, function(sResult){
			__restCallbackHandler(1, gid, sResult, oCallback, errCallback);
		});		
	},
	wb.message_notelist = function(page, oCallback, errCallback){
		/* login required; new */
		return JA.net.get("https://m.weibo.cn/message/notelist", 
			{page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});		
	};
	wb.message_msglist = function(page, oCallback, errCallback){
		/* login required; new */
		return JA.net.get("https://m.weibo.cn/message/msglist", 
			{page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});		
	};
	wb.message_timeline = wb.message_notelist;
	wb.dm_message_timeline = wb.message_msglist;
	wb.report = function(uid, oid, rid, args, oCallback, errCallback, type = 1){
		//report spam
		//uid self, oid object id
		//type 1 weibo, type 3 user
		var ref = "https://service.account.weibo.com/reportspam?rid="+rid+"&type=1&from=1110096039&__ref";
		var elem = $("<iframe>", {style:"visibility:hidden"});
		elem.appendTo('.large-header');
		var loadReportWnd = function(){
			var defer = $.Deferred(); 
			elem.attr("src", ref);
			elem.on("load", function(){
				defer.resolve();
			});
			return defer;
		};
		//report spam
		//uid self, oid object id
		var postReport = function(){
			return JA.net.post("https://service.account.weibo.com/aj/reportspam?__ref&__rnd="+new Date().getTime(), 
				{category:args.cid||8, tag_id:args.tag, extra:args.extra||"", url:"", type:1, rid:rid,  
				uid:uid, r_uid:oid, from:1110096039, getrid:rid, appGet:0, weiboGet:0,blackUser:0, _t:0}, 
				function(sResult){
				__restCallbackHandler(0, rid, sResult, oCallback, errCallback);
				elem.remove();
			}, "json");
		};
		return loadReportWnd().then(postReport);
	};
	wb.m_report = function(uid, oid, rid, args, oCallback, errCallback, type = 1){
		//report spam
		//uid self, oid object id
		//type 1 weibo, type 3 user
		var ref = "https://service.account.weibo.com/reportspamobile?rid="+rid+"&type=1&from=20000&__ref";
		var elem = $("<iframe>", {style:"visibility:hidden"});
		elem.appendTo('.large-header');
		var loadReportWnd = function(){
			var defer = $.Deferred(); 
			elem.attr("src", ref);
			elem.on("load", function(){
				defer.resolve();
			});
			return defer;
		};
		var postReport = function(){
			return JA.net.post("https://service.account.weibo.com/aj/reportspamobile?__ref="+encodeURIComponent(ref)+"&__rnd="+new Date().getTime(), 
				{category:args.cid||8, tag_id:args.tag, extra:args.extra||"", url:"", type:type, rid:rid,  
				uid:uid, r_uid:oid, from:20000, getrid:rid, appGet:0, weiboGet:0,blackUser:0, _t:0}, 
				function(sResult){
				__restCallbackHandler(0, rid, sResult, oCallback, errCallback);
				elem.remove();
			}, "json");
		};
		return loadReportWnd().then(postReport);
	};
	wb.reportUser = function(uid, oid, rid, args, oCallback, errCallback){
		return wb.report(uid, oid, rid, args, oCallback, errCallback, 3);
	};
	wb.suggest = function(){
		return JA.net.get("https://www.weibo.com/aj/topic/suggest?ajwvr=6&__rnd="+new Date().getTime(), 
			{}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.comment = function(content, mid, uid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/v6/comment/add?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
				{act:"post", mid:mid, uid:uid, forward:0, isroot:0, content:content, module:"bcommlist", location:"v6_content_home", pdetail:"100505"+uid, _t:0}, function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.m_comment = function(content, mid, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/api/comments/create", 
			{id:mid, content:content, mid:mid, st:__st, _spr:"screen:414x736"}, function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});		
	};
	wb.m_comment_reply = function(content, mid, cid, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/api/comments/reply", 
			{content:content, mid:mid, reply:cid, cid:cid, withReply:1, st:__st, _spr:"screen:1536x864"}, function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});
	};
	wb.comments_by_me = function(page, oCallback, errCallback){
		/* login required */
		return JA.net.get("https://m.weibo.cn/msg/mycmts?subtype=myComent&format=cards", 
			{page:page}, function(sResult){
				sResult = sResult[0]; sResult.ok = 1;
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.comments_by_mev2 = function(page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/message/myCmt", 
			{page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.comments_to_me = function(page, oCallback, errCallback){
		/* login required */
		return JA.net.get("https://m.weibo.cn/msg/cmts?author=&subtype=allComment&format=cards", 
			{page:page}, function(sResult){
				sResult = sResult[0]; sResult.ok = 1;
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});		
	};
	wb.comments_to_mev2 = function(page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/message/cmt", 
			{page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.comments_destroy = function(cid, byMe, oCallback, errCallback){
		//default byMe = true
		var args = {cid:cid, _t:0};
		if(!byMe){
			args = $.extend(args, {block:1, location:"v6_comment_inbox"});
		}
		return JA.net.post("https://www.weibo.com/aj/comment/del?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			args, function(sResult){
			__restCallbackHandler(0, cid, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_show = function(wid, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/statuses/show?__ref", 
			{id:wid}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_showV2 = function(wid, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/ajax/statuses/show?__ref", 
			{id:wid}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_comment = function(wid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/comments/show?__ref", 
			{id:wid, page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_attitude = function(wid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/attitudes/show?__ref", 
			{id:wid, page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_repost = function(wid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/statuses/repostTimeline?__ref", 
			{id:wid, page:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.favorites_destroy = function(mid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/fav/mblog/del?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{mid:mid, location:"v6_fav"}, function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.m_favorites_destroy = function(mid, oCallback, errCallback){
		return JA.net.post("https://m.weibo.cn/mblogDeal/delFavMblog", 
			{id:mid, st:__st, _spr:"screen:1536x864"}, function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});
	};
	wb.users_show = function(uid, oCallback, errCallback){
		return JA.net.get("https://api.weibo.com/webim/2/users/show.json?__ref&source=209678993&__rnd="+new Date().getTime(), 
			{uid:uid}, function(sResult){
				//match format
				!sResult.error&&(sResult.data = sResult,sResult.code = 10000);
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.users_showbatch = function(uids, oCallback, errCallback){
		return JA.net.get("https://api.weibo.com/2/users/show_batch.json?__ref&source=209678993&__rnd="+new Date().getTime(), 
			{uids:uids}, function(sResult){
				//match format
				!sResult.error&&(sResult.data = sResult,sResult.code = 10000);
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.users_showme = function(oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/users/show", {}, function(sResult){
			//remove errCallback to fix 1.5.2
			__restCallbackHandler(1, null, sResult, oCallback);
		});
	};
	wb.user_profile = function(uid, oCallback, errCallback){
		return JA.net.get("https://api.weibo.com/webim/2/users/show.json", {uid:uid, source:209678993}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		}, function(xhr){
		});
	};
	wb.user_profile_v2 = function(uid, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/profile/info", {uid:uid}, function(sResult){
			sResult.ok = 1;
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		}, function(xhr){
		});
	};	
	//Compatible with 11 tweets
	wb.m_user_timeline = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid:"107603"+uid, type:"uid", value:uid, page:page}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.user_timeline = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid:"230413"+uid+"_-_WEIBO_SECOND_PROFILE_WEIBO", page_type:"03", page:page}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.user_timeline_v2 = function(uid, page, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/ajax/statuses/mymblog", {uid:uid, page:page, feature:0}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		}, function(xhr){
		});
	};
	wb.user_timeline_bytime = function(uid, page, year, month, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/ajax/statuses/mymblog", 
			{uid:uid, page:page, feature:0, displayYear:year, curMonth:month, stat_date:year+month}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});		
	};
	wb.user_timeline_search = function(uid, page, q, oCallback, errCallback){
		return JA.net.get("https://www.weibo.com/ajax/profile/searchblog", 
			{uid:uid, page:page, feature:0, q:q}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});		
	};
	wb.hot_timeline = function(page, categroy, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid:"102803"+(categroy||""), since_id:page}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.statuses_like_destory = function(mid, oCallback, errCallback){
		/* create or destory like of statuses */
		return JA.net.post("https://www.weibo.com/aj/v6/like/add?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{mid:mid, qid:"heart", version:"mini", _t:0}, function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.m_like_create = function(mid, oCallback, errCallback){
		/* create or destory like of statuses */
		return JA.net.post("https://m.weibo.cn/api/attitudes/create", 
			{id:mid, attitude:"heart", st:__st, _spr:"screen:1536x864"}, function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});
	};	
	wb.like_create = wb.statuses_like_destory;
	wb.like_destory = function(mid, oCallback, errCallback){
		/* destory like of statuses */
		return JA.net.post("https://www.weibo.com/aj/like/del?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{mid:mid}, function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.blacklist_create = function(uid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/filter/block?ajwvr=6", 
			{uid:uid, filter_type:1, status:1, interact:1, follow:1}, function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};
	//65 , 67
	wb.blacklist_users2 = function(uid, page, oCallback, errCallback){
		return $.get("https://www.weibo.com/p/100606"+uid+"/myfollow?pids=Pl_Official_RelationBlacklist__65&cfs=600&relate=blacklist&__ref", 
			{Pl_Official_RelationBlacklist__65_page:page, ajaxpagelet:1, ajaxpagelet_v6:1}, function(sResult){
			__htmlCallbackHandler(null, sResult, oCallback, errCallback);
		});
	};
	wb.blacklist_users = function(uid, page, oCallback, errCallback){
		let ver = 83;
		return $.get("https://www.weibo.com/p/100505"+uid+"/myfollow?pids=Pl_Official_RelationBlacklist__82&cfs=600&relate=blacklist&__ref", 
			{Pl_Official_RelationBlacklist__82_page:page, ajaxpagelet:1, ajaxpagelet_v6:1}, function(sResult){
			__htmlCallbackHandler(null, sResult, oCallback, errCallback);
		});
	};
	wb.blacklist_destory = function(uid, oCallback, errCallback){
		return JA.net.post("https://www.weibo.com/aj/f/delblack?__ref&ajwvr=6", 
			{uid:uid, _t:0}, function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};	
	wb.authorize_apps = function(page, oCallback, errCallback){
		return $.get("https://app.weibo.com/my?type=&__ref", {p:page}, function(sResult){
			__htmlCallbackHandler(null, sResult, oCallback, errCallback);
		});
	};
	wb.authorize_destory = function(appid, oCallback, errCallback){
		/* create or destory like of statuses */
		return JA.net.post("https://app.weibo.com/aj_app_revoke.php?__ref=", 
			{app_id:appid, _t:0}, function(sResult){
			__restCallbackHandler(0, appid, sResult, oCallback, errCallback);
		});
	};
	wb.dmmessage_destory = function(uid, oCallback, errCallback){
		/* create or destory like of statuses */
		return JA.net.post("https://www.weibo.com/aj/message/destroy?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{"uid":uid, _t:0}, function(sResult){
			__restCallbackHandler(0, uid, sResult, oCallback, errCallback);
		});
	};
	wb.message_destory = function(id, oCallback, errCallback){
		/* create or destory like of statuses */
		return JA.net.post("https://www.weibo.com/aj/notebox/destroy?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{"ids[]":id, _t:0}, function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	wb.repost = function(mid, uid, reason, is_comment, oCallback, errCallback){
		//uid self
		return JA.net.post("https://www.weibo.com/aj/v6/mblog/forward?ajwvr=6&domain=100505&__rnd="+new Date().getTime(), 
			//is_comment 0, 1 with comment
			{mid:mid, pdetail:"100505"+uid, _t:0, style_type:1, reason:reason||"转发微博", location:"page_100505_home", rank:0, is_comment_base:is_comment||false}, 
			function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.m_repost = function(mid, reason, is_comment, oCallback, errCallback){
		//uid self
		return JA.net.post("https://m.weibo.cn/api/statuses/repost", 
			//is_comment 0, 1 with comment
			{mid:mid, id:mid, dualPost:is_comment||0, content:reason||"转发微博", st:__st, _spr:"screen:0x0"}, 
			function(sResult){
			__restCallbackHandler(1, mid, sResult, oCallback, errCallback);
		});
	};	
	wb.statuses_modify_visiable = function(mid, visible, oCallback, errCallback){
		//0 normal, 1 meonly, 2 friendsonly
		return JA.net.post("https://www.weibo.com/p/aj/v6/mblog/modifyvisible?__ref&ajwvr=6&domain=100505&__rnd="+new Date().getTime(), 
			{mid:mid, visible:visible, _t:0}, function(sResult){
			__restCallbackHandler(0, mid, sResult, oCallback, errCallback);
		});
	};
	wb.fix_contacts = function(type, oCallback, errCallback){
		//1, followers; 2, friends
		return JA.net.post("http://kefu.weibo.com/ajax/correction", 
			{type:type}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.user_articles = function(uid, page, oCallback, errCallback){
		return $.get("https://www.weibo.com/p/100505"+uid+"/wenzhang?pids=Pl_Core_ArticleList__61&cfs=600&Pl_Core_ArticleList__61_filter=&filter=&time=&type=&ajaxpagelet=1&ajaxpagelet_v6=1", 
			{Pl_Core_ArticleList__47_page:page, __ref:"https://www.weibo.com/p/100505"+uid+"/wenzhang"}, function(sResult){
			__htmlCallbackHandler(null, sResult, oCallback, errCallback);
		});
	};
	wb.user_articlesv2 = function(uid, page, oCallback, errCallback){
		return $.get("https://www.weibo.com/p/100206"+uid+"/wenzhang?pids=Pl_Core_ArticleList__46&is_article=1&visible=0&is_search=0&is_tag=0&profile_ftype=1&ajaxpagelet=1&ajaxpagelet_v6=1", 
			{page:page, __ref:"https://www.weibo.com/p/100206"+uid+"/wenzhang"}, function(sResult){
			__htmlCallbackHandler(null, sResult, oCallback, errCallback);
		});
	};
	wb.article_destory = function(id, oCallback, errCallback){
		/* create or destory like of statuses */
		return JA.net.post("https://www.weibo.com/ttarticle/p/aj/delete?__ref&ajwvr=6&__rnd="+new Date().getTime(), 
			{"id":id, _t:0}, function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	wb.article_destoryv2 = function(uid, id, oCallback, errCallback){
		/* destory article v2 */
		return JA.net.post("https://www.weibo.com/p/aj/official/dellongfeed?ajwvr=6", 
			{page_id:id, authorid:uid}, function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	wb.m_search = function(uid, query, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{profile_containerid:"231802_"+uid, profile_uid:uid, disable_sug:1, trans_bg:1, disable_history:1, hint:"搜我的微博", luicode:10000011, lfid:"230413"+uid+"_-_WEIBO_SECOND_PROFILE_WEIBO", container_ext:"profile_uid:"+uid+"|hint=搜我的微博|nettype:|gps_timestamp:"+new Date().getTime(), containerid:"100103type=401&q=&t=10"+query,page_type:"searchall"},
			function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.m_searchV2 = function(query, page, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid:"100103type=1&q="+query+"&t=0", page_type:"searchall", page:page},
			function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.checkfollower = function(id, nick, oCallback, errCallback){
		return JA.net.get("https://pay.biz.weibo.com/aj/designate/searchusers?__ref", 
			{keyword:nick}, function(sResult){
			__restCallbackHandler(0, id, sResult, oCallback, errCallback);
		});
	};
	wb.unfollowerList = function(page, oCallback, errCallback){
		return JA.net.get("https://dss.sc.weibo.com/h5/aj/chart/fans/unfollowerList?__ref&_="+new Date().getTime(), 
			{page:page, single:1}, function(sResult){
			__restCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.accountInfo = function(uid, oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/container/getIndex", 
			{containerid:"230283"+uid+"_-_INFO"}, function(sResult){
			__restCallbackHandler(1, uid, sResult, oCallback, errCallback);
		});
	};
	wb.changeversion = function(ver, oCallback, errCallback){
		return JA.net.get("https://weibo.com/ajax/changeversion?__ref", 
			{status:ver}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	wb.config = function(oCallback, errCallback){
		return JA.net.get("https://m.weibo.cn/api/config", {}, function(sResult){
			__restCallbackHandler(1, null, sResult, oCallback, errCallback);
		});
	};
	__restCallbackHandler = function(ismweibo, arg, sResult, oCallback, errCallback){
		if(ismweibo){
			var bStatus = (sResult.ok === 1);
		}else{
			var code = parseInt(sResult.code);
			var bStatus = (code === 100000||code === 1000);
		}
		if(bStatus && typeof oCallback != "undefined") {
			oCallback(sResult, arg);
		}else if(typeof errCallback != "undefined"){
			errCallback(sResult);
		}
	};
	__htmlCallbackHandler = function(arg, sResult, oCallback, errCallback){
		var bStatus = true;
		if(bStatus && typeof oCallback != "undefined") {
			oCallback(sResult, arg);
		}else if(typeof errCallback != "undefined"){
			errCallback(sResult);
		}
	};
	return wb;
}();

JA.mapi = function(){
	var wb = {};
	wb.statuses_update = function(content, mediaObj, taskid, defaultParams, oCallback, errCallback){
		let extparam = "";
		if(taskid){
			extparam = `creator_task:ostatuses_${taskid}_0`;
		}
		let media = [];
		mediaObj = mediaObj||[];
		//only support PIC
		mediaObj.forEach(function(item){
			let data = {"filterMethod":1,"bypass":"unistore.image","createtype":"localfile","pic_source":0,"encrypted":false,"picStatus":1,
			"fid":item,"pic_raw_md5":item, "type":"pic"	};
			media.push(data);
		});
		let ext = "effectname:|network:wifi|";
		if(extparam){
			ext += extparam + "|";
		}
		if(mediaObj){
			ext += mediaObj.join("_")+"|null_null|null_null|Label=0_0";
		}else{
			ext += "(null)|activity_picnum:0";
		}
		
		return JA.net.post(`https://api.weibo.cn/2/statuses/send?__ref&gsid=${defaultParams.gsid}&s=${defaultParams.s}&from=${defaultParams.from||"10B6095010"}&c=${defaultParams.c||"android"}`,
		{content:content, rcontent:content, media:JSON.stringify(media), ext:ext, extparam:extparam, act:"add"}, function(sResult){
			__mapiCallbackHandler(0, taskid, sResult, oCallback, errCallback);
		});
	};
	wb.tasks_join = function(id, defaultParams, oCallback, errCallback){
		return JA.net.get("https://api.weibo.cn/2/!/wbox/qgb2672tlf/nationtask_joinos?__ref", 
			{id:id, gsid:defaultParams.gsid, s:defaultParams.s, from:defaultParams.from||"10B6095010", c:defaultParams.c||"android"}, function(sResult){
			__mapiCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.tasks_list = function(page, defaultParams, oCallback, errCallback){
		return JA.net.get("https://mapi.weibo.com/2/!/wbox/qgb2672tlf/nationtask_tasklist?__ref", 
			{page:page, gsid:defaultParams.gsid, s:defaultParams.s, from:defaultParams.from||"10B6095010", c:defaultParams.c||"android"}, function(sResult){
			__mapiCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	wb.tasks_detail = function(id, defaultParams, oCallback, errCallback){
		return JA.net.get("https://mapi.weibo.com/2/!/wbox/qgb2672tlf/nationtask_otaskinfo?__ref", 
			{id:id, gsid:defaultParams.gsid, s:defaultParams.s, from:defaultParams.from||"10B6095010", c:defaultParams.c||"android"}, function(sResult){
			__mapiCallbackHandler(0, null, sResult, oCallback, errCallback);
		});
	};
	__mapiCallbackHandler = function(ismweibo, arg, sResult, oCallback, errCallback){
		var bStatus = false;
		//statuses_update wont return code
		if(sResult.code == 0||sResult.appid){
			bStatus = true;
		}

		if(bStatus && typeof oCallback != "undefined") {
			oCallback(sResult, arg);
		}else if(typeof errCallback != "undefined"){
			errCallback(sResult);
		}
	};
	return wb;
}();

JA.api = function(){
	var wb = {}, _server = "https://api.weibo.com/2";
	wb.users_show = function(uid, oCallback, errCallback){
		__parseCMD("/users/show.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uid:uid
		},{
		    method: 'get'
		});
	};
	wb.friendships_friends = function(uid, count, cursor, oCallback, errCallback){
		// 获取朋友列表
		__parseCMD("/friendships/friends.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uid : uid,
			count : count,
			cursor : cursor
		},{
		    method: 'get'
		});
	};
	wb.friendships_followers = function(uid, count, cursor, oCallback, errCallback){
		// 获取朋友列表
		__parseCMD("/friendships/followers.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uid : uid,
			count : count,
			cursor: cursor
		},{
		    method: 'get'
		});
	};
	wb.statuses_comments = function(id, count, page, oCallback, errCallback){
	    // 根据微博消息ID返回某条微博消息的评论列表 
		__parseCMD("/comments/show.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			id : id,
			count : count,
			page : page
		},{
		    method: 'get'
		});
	};
	wb.public_timeline = function(count, oCallback, errCallback){
	    // 获取公共微博列表
		__parseCMD("/statuses/public_timeline.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			count : count
		},{
		    method: 'get'
		});
	};
	wb.user_timeline = function(uid, count, page, oCallback, errCallback){
	    // 获取用户微博列表
		__parseCMD("/statuses/user_timeline.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			page : page,
			count : count,
			user_id : uid
		},{
		    method: 'get'
		});
	};
	wb.timeline_batch = function(uid, count, page, oCallback, errCallback){
	    // 将一个或多个长链接转换成短链接 url_long=aaa&url_long=bbb。
		// auth = false
		__parseCMD("/statuses/timeline_batch.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			page : page,
			count : count,
			uids : uid
		},{
		    method: 'get'
		});
	};
	wb.friends_timeline = function(count, page, oCallback, errCallback){
	    // 获取用户微博列表
		__parseCMD("/statuses/friends_timeline.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			count : count,
			page: page,
			feature: 0 //0全部，1原创，2图片，3视频，4音乐
		},{
		    method: 'get'
		});
	};
	wb.comments_by_me = function(count, page, oCallback, errCallback){
	    // 批量获取n条微博消息的评论数和转发数
		__parseCMD("/comments/by_me.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			count : count,
			page : page
		},{
		    method: 'get'
		});
	};
	wb.comments_to_me = function(count, page, oCallback, errCallback){
	    // 批量获取n条微博消息的评论数和转发数
		__parseCMD("/comments/to_me.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			count : count,
			page : page
		},{
		    method: 'get'
		});
	};
	wb.favorites = function(count, page, oCallback, errCallback){
	    // 获取当前登录用户的收藏列表
		__parseCMD("/favorites.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			count : count,
			page : page
		},{
		    method: 'get'
		});
	};
	wb.favorites_destroy = function(id, oCallback, errCallback){
	    // 取消收藏一条微博
		__parseCMD("/favorites/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			id : id
		},{
		    method: 'post'
		});
	};
	wb.statuses_counts = function(ids, oCallback, errCallback){
	    // 批量获取n条微博消息的评论数和转发数
		__parseCMD("/statuses/counts.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			ids : ids
		},{
		    method: 'get'
		});
	};
	wb.statuses_show = function(id, oCallback, errCallback){
	    // 根据ID获取单条微博消息，以及该微博消息的作者信息
		__parseCMD("/statuses/show.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			id : id
		},{
		    method: 'get'
		});
	};
	wb.statuses_update = function(status, oCallback, errCallback){
	    // 发布一条微博信息。也可以同时转发某条微博。请求必须用POST方式提交。
		__parseCMD("/statuses/update.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			status : status
		},{
		    method: 'post'
		});
	};
	wb.statuses_upload_url_text = function(status, url, oCallback, errCallback){
	    // 指定一个图片URL地址抓取后上传并同时发布一条新微博 高级接口（需要授权）
		__parseCMD("/statuses/upload_url_text.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			status : status,
			url : url
		},{
		    method: 'post'
		});
	};
	wb.statuses_destroy = function(id, oCallback, errCallback){
	    // 根据微博ID删除指定微博 。
		__parseCMD("/statuses/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			id : id
		},{
		    method: 'post'
		});
	};
	wb.statuses_comments_destroy_batch = function(ids, oCallback, errCallback){
	    // 批量删除评论。注意：只能删除登录用户自己发布的评论，不可以删除其他人的评论。 
		__parseCMD("/comments/destroy_batch.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			//最多20个 
			ids : ids
		},{
		    method: 'post'
		});
	};
	wb.comments_destroy = function(cid, oCallback, errCallback){
	    // 删除一条评论
		__parseCMD("/comments/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			cid : cid
		},{
		    method: 'post'
		});
	};
	wb.statuses_comment = function(statusid, comment, oCallback, errCallback){
	    // 对一条微博信息进行评论。请求必须用POST方式提交。
		__parseCMD("/statuses/comment.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			id : statusid,
			comment : comment
		},{
		    method: 'post'
		});
	};
	wb.statuses_repost = function(statusid, status, oCallback, errCallback){
	    // 对一条微博信息进行转发。请求必须用POST方式提交。#暂时不支持
		__parseCMD("/statuses/repost.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			id : statusid,
			status : status
		},{
		    method: 'post'
		});
	};
	wb.statuses_unread = function(oCallback, errCallback){
	    // 取消对某用户的关注。
		__parseCMD("/friendships/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
		    method: 'get'
		});
	};
	wb.statuses_mentions = function(count, page, oCallback, errCallback){
	    // 获取最新的提到登录用户的微博列表，即@我的微博
		__parseCMD("/friendships/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			count : count,
			page: page
		},{
		    method: 'get'
		});
		
	};
	wb.users_counts = function(uids, oCallback, errCallback){
	    // 批量获取用户的粉丝数、关注数、微博数。
		__parseCMD("/users/counts.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uids : uids
		},{
		    method: 'get'
		});
	};
	wb.friendships_create = function(uid, oCallback, errCallback){
	    // 关注一个用户。关注成功则返回关注人的资料，目前的最多关注2000人。
		__parseCMD("/friendships/create.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uid : uid
		},{
		    method: 'post'
		});
	};
	wb.friendships_destroy = function(uid, oCallback, errCallback){
	    // 取消关注一个用户 。
		__parseCMD("/friendships/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uid : uid
		},{
		    method: 'post'
		});
	};
	wb.friendships_followers_destroy = function(uid, oCallback, errCallback){
	    // 取消一个粉丝 。
		__parseCMD("/friendships/followers/destroy.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			uid : uid
		},{
		    method: 'post'
		});
	};
	wb.rate_limit_status = function(source, oCallback, errCallback){
	    // 获取API的访问频率限制。
		__parseCMD("/account/rate_limit_status.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			source : source
		},{
		    method: 'get'
		});
	};

	wb.short_url_shorten = function(url_long , source, oCallback, errCallback){
	    // 将一个或多个长链接转换成短链接 url_long=aaa&url_long=bbb。
		// auth = false
		__parseCMD("/short_url/shorten.json", function(sResult, bStatus){
			__apiCallbackHandler(sResult, bStatus, oCallback, errCallback);
		},{
			url_long : url_long,
			source : source
		},{
		    method: 'get'
		});
	};
	__parseCMD = function(api, callback, args, http_method){
		var _args = {source:__appkey||JA.config.appkey, _cache_time:0, __rnd:new Date().getTime(), access_token:__token||JA.config.access_token};
		var parameters = $.extend(_args, args);
		if(http_method.method == "get"){
			$.get(_server+api, parameters, function(sResult){
				if(sResult.error){
					callback(sResult, false);
				}else{
					callback(sResult, true);
				}
			}).fail(function(){
			    callback({}, false);
			});
		}else{
			$.post(_server+api, parameters, function(sResult){
				if(sResult.error){
					callback(sResult, false);
				}else{
					callback(sResult, true);
				}
			}, "json");
		}
	};
	__apiCallbackHandler = function(sResult, bStatus, oCallback, errCallback){
		if(bStatus == true && typeof oCallback != "undefined") {
			oCallback(sResult);
		}
		else if(bStatus == false && typeof errCallback != "undefined"){
			errCallback(sResult);
		}
	};
	return wb;
}();
/*
JA.sdk = function(){
		var wb = {};
		wb.friendships_friends = function(uid, count, cursor, oCallback, errCallback){
			WB2.anyWhere(function(W){
				// 获取朋友列表
				W.parseCMD("/friendships/friends.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid : uid,
					count : count,
					cursor : cursor
				},{
				    method: 'get'
				});
			});
		};
		wb.friendships_followers = function(uid, count, cursor, oCallback, errCallback){
			WB2.anyWhere(function(W){
				// 获取朋友列表
				W.parseCMD("/friendships/followers.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid : uid,
					count : count,
					cursor: cursor
				},{
				    method: 'get'
				});
			});
		};
		wb.statuses_comments = function(id, count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 根据微博消息ID返回某条微博消息的评论列表 
				W.parseCMD("/comments/show.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					id : id,
					count : count,
					page : page
				},{
				    method: 'get'
				});
			});
		};
		wb.public_timeline = function(count, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 获取公共微博列表
				W.parseCMD("/statuses/public_timeline.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					count : count
				},{
				    method: 'get'
				});
			});
		};
		wb.user_timeline = function(uid, count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 获取用户微博列表
				W.parseCMD("/statuses/user_timeline.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					page : page,
					count : count,
					user_id : uid
				},{
				    method: 'get'
				});
			});
		};
		wb.timeline_batch = function(uid, count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 将一个或多个长链接转换成短链接 url_long=aaa&url_long=bbb。
				// auth = false
				W.parseCMD("/statuses/timeline_batch.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					page : page,
					count : count,
					uids : uid
				},{
				    method: 'get'
				});
			});	
		};
		wb.friends_timeline = function(count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 获取用户微博列表
				W.parseCMD("/statuses/friends_timeline.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					count : count,
					page: page,
					feature: 0 //0全部，1原创，2图片，3视频，4音乐
				},{
				    method: 'get'
				});
			});
		};
		wb.comments_by_me = function(count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 批量获取n条微博消息的评论数和转发数
				W.parseCMD("/comments/by_me.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					count : count,
					page : page
				},{
				    method: 'get'
				});
			});
		};
		wb.favorites = function(count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 获取当前登录用户的收藏列表
				W.parseCMD("/favorites.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					count : count,
					page : page
				},{
				    method: 'get'
				});
			});
		};
		wb.favorites_destroy = function(id, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 取消收藏一条微博
				W.parseCMD("/favorites/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					id : id
				},{
				    method: 'post'
				});
			});
		};
		wb.statuses_counts = function(ids, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 批量获取n条微博消息的评论数和转发数
				W.parseCMD("/statuses/counts.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					ids : ids
				},{
				    method: 'get'
				});
			});
		};
		wb.statuses_show = function(id, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 根据ID获取单条微博消息，以及该微博消息的作者信息
				W.parseCMD("/statuses/show.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					id : id
				},{
				    method: 'get'
				});
			});
		};
		wb.statuses_update = function(status, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 发布一条微博信息。也可以同时转发某条微博。请求必须用POST方式提交。
				W.parseCMD("/statuses/update.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					status : status
				},{
				    method: 'post'
				});
			});
		};
		wb.statuses_upload_url_text = function(status, url, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 指定一个图片URL地址抓取后上传并同时发布一条新微博 高级接口（需要授权）
				W.parseCMD("/statuses/upload_url_text.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					status : status,
					url : url
				},{
				    method: 'post'
				});
			});
		};
		wb.statuses_destroy = function(id, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 根据微博ID删除指定微博 。
				W.parseCMD("/statuses/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					id : id
				},{
				    method: 'post'
				});
			});	
		};
		wb.statuses_comments_destroy_batch = function(ids, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 批量删除评论。注意：只能删除登录用户自己发布的评论，不可以删除其他人的评论。 
				W.parseCMD("/comments/destroy_batch.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					//最多20个 
					ids : ids
				},{
				    method: 'post'
				});
			});	
		};
		wb.comments_destroy = function(cid, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 删除一条评论
				W.parseCMD("/comments/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					cid : cid
				},{
				    method: 'post'
				});
			});	
		};
		wb.statuses_comment = function(statusid, comment, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 对一条微博信息进行评论。请求必须用POST方式提交。
				W.parseCMD("/statuses/comment.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					id : statusid,
					comment : comment
				},{
				    method: 'post'
				});
			});	
		};
		wb.statuses_repost = function(statusid, status, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 对一条微博信息进行转发。请求必须用POST方式提交。#暂时不支持
				W.parseCMD("/statuses/repost.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					id : statusid,
					status : status
				},{
				    method: 'post'
				});
			});
		};
		wb.statuses_unread = function(oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 取消对某用户的关注。
				W.parseCMD("/friendships/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
				    method: 'get'
				});
			});	
		};
		wb.statuses_mentions = function(count, page, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 获取最新的提到登录用户的微博列表，即@我的微博
				W.parseCMD("/friendships/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					count : count,
					page: page
				},{
				    method: 'get'
				});
			});	
			
		};
		wb.users_counts = function(uids, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 批量获取用户的粉丝数、关注数、微博数。
				W.parseCMD("/users/counts.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uids : uids
				},{
				    method: 'get'
				});
			});				
		};
		wb.users_show = function(uid, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 根据用户ID获取用户信息 
				W.parseCMD("/users/show.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid : uid
				},{
				    method: 'get'
				});
			});
		};
		
		wb.friendships_create = function(uid, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 关注一个用户。关注成功则返回关注人的资料，目前的最多关注2000人。
				W.parseCMD("/friendships/create.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid : uid
				},{
				    method: 'post'
				});
			});	
		};
		wb.friendships_destroy = function(uid, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 取消关注一个用户 。
				W.parseCMD("/friendships/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid : uid
				},{
				    method: 'post'
				});
			});	
		};
		wb.friendships_followers_destroy = function(uid, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 取消一个粉丝 。
				W.parseCMD("/friendships/followers/destroy.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid : uid
				},{
				    method: 'post'
				});
			});	
		};
		wb.rate_limit_status = function(source, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 获取API的访问频率限制。
				W.parseCMD("/account/rate_limit_status.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					source : source
				},{
				    method: 'get'
				});
			});	
		};

		wb.short_url_shorten = function(url_long , source, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 将一个或多个长链接转换成短链接 url_long=aaa&url_long=bbb。
				// auth = false
				W.parseCMD("/short_url/shorten.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					url_long : url_long,
					source : source
				},{
				    method: 'get'
				});
			});	
		};
		wb.users_show = function(uid, oCallback, errCallback){
			WB2.anyWhere(function(W){
			    // 将一个或多个长链接转换成短链接 url_long=aaa&url_long=bbb。
				// auth = false
				W.parseCMD("/users/show.json", function(sResult, bStatus){
					__callbackHandler(sResult, bStatus, oCallback, errCallback);
				},{
					uid:uid
				},{
				    method: 'get'
				});
			});	
		};
		__callbackHandler = function(sResult, bStatus, oCallback, errCallback){
			if(bStatus == true && typeof oCallback != "undefined") {
				oCallback(sResult);
			}
			else if(bStatus == false && typeof errCallback != "undefined"){
				errCallback(sResult);
			}
		};
	return wb;
}();
*/
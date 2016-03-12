var menu_layout = {};
menu_layout.LEFT_MENU_WIDTH = 270;
menu_layout.SCROLLBAR_WIDTH = 0;

menu_layout.init = function(container,items){
	var currentPageId = $(".master.container").attr("id");
	var currentPageSlug = $(".master.container").attr("data-itemslug");
	if (XPRSHelper.isChrome()){
		menu_layout.SCROLLBAR_WIDTH = 0;
		//$(".master.container").addClass("chrome");
	}
	items.each(function(){
		var currentItem = $(this);
		
		//Mark link of the current page
		currentItem.find(".preview-item-links a").each(function(){
			var linkStr = $(this).attr("href");
			if (linkStr){
				//remove query params
				if (linkStr.indexOf("?") != -1){
					linkStr = linkStr.substring(0,linkStr.indexOf("?"));
				}
				//match slug or vbid
				var linkToCurrentPage = linkStr.indexOf(currentPageId, linkStr.length - currentPageId.length) !== -1;
				linkToCurrentPage = linkToCurrentPage || linkStr.indexOf(currentPageSlug, linkStr.length - currentPageSlug.length) !== -1;
				if (linkToCurrentPage){
					$(this).addClass("current-page");
					//do not mark more than one even if found
					return false;
				}
			}
		});
		
		//LEFT MENU
		var holder = container.closest(".master.item-box");
		var settings = holder.find(".layout-settings");
		var menuPosition = settings.attr("data-menu_position");
		if (menuPosition == "none"){
			holder.css("display","none");
		}else if (menuPosition == "left"){
			$(".master.container").find("#children").first().css("width",$(window).innerWidth() - menu_layout.SCROLLBAR_WIDTH - menu_layout.LEFT_MENU_WIDTH);
			$(".left-menu-placeholder").height($(window).height());
		}else{
			$(".master.container").find("#children").first().css("width","");
		}
		
		var previewTitle = currentItem.find(".preview-title");
		//var previewSubtitle = currentItem.find(".preview-subtitle");
		var rightSideDiv = currentItem.find('.right-div');
		var leftSideDiv = currentItem.find('.left-div');
		var stripe = container.closest(".master.item-box");
		totalLinksWidth = rightSideDiv.outerWidth(true);
		
		//Saving the original links width for unmenufying - only if we are not centered
		if (!rightSideDiv.hasClass("centerified")){
			stripe.attr("data-original-menu-width",totalLinksWidth);
		}
		
		//no shrink if title is not present
		var originalFontSize = "N/A";
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length == 0){
			originalFontSize = Math.round(parseInt(previewTitle.css("font-size")));
			leftSideDiv.attr("data-orig-font-size",originalFontSize);
		}
		
		//If no subtitle and no title found link will be aligned to center
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length > 0 && currentItem.find(".element-placeholder[data-elementtype='SUBTITLE']").length > 0){
			currentItem.find(".helper-div").hide();
			if (currentItem.find(".element-placeholder[data-elementtype='ICON']").length > 0){
				menu_layout.centerifyLinks(leftSideDiv,rightSideDiv);
			}else{
				menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
			}
		}else{
			currentItem.find(".helper-div").show();
			menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
		}
	});
};

menu_layout.centerifyLinks = function(leftSideDiv,rightSideDiv){
	leftSideDiv.css({"width":0,"display":"inline"});
	rightSideDiv.css({"width":"100%","text-align":"center"}).addClass("centerified");
};

menu_layout.uncenterifyLinks = function(leftSideDiv,rightSideDiv){
	leftSideDiv.css({"width":"","display":""});
	rightSideDiv.css({"width":"","text-align":""}).removeClass("centerified");;
};

menu_layout.applyLayout = function(container,items,paramsFromRealTime){
	var holder = container.closest(".master.item-box");
	var masterContainer = $(".master.container");
	items.each(function(){
		var currentItem = $(this);
		currentItem.find(".preview-item-links").css("display","");
		var settings = container.closest(".master.item-box").find(".layout-settings");
		
		var alwaysMinify = settings.attr("data-always_minified") == "true";
		 
		var menuAlign = settings.attr("data-menu_align");
		if(holder.find(".item-wrapper").innerWidth() < 400){
			menuAlign = "left";
			holder.addClass("force-min-height50 minimal-design");
		}else{
			holder.removeClass("force-min-height50 minimal-design");
		}
		var menuPosition = settings.attr("data-menu_position");
		
		
		if (menuPosition == "none"){
			holder.css("display","none");
			//return;
		}else if (menuPosition == "left"){
			holder.css("display","");
			holder.removeClass("minimal-design");
			masterContainer.find("#children").first().css("width",$(window).innerWidth() - menu_layout.SCROLLBAR_WIDTH - menu_layout.LEFT_MENU_WIDTH);
			$(".left-menu-placeholder").height($(window).height());
		}else{
			holder.css("display","");
			masterContainer.find("#children").first().css("width","");
			//holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
			if (holder.find('.preview-icon-holder').length > 0){
				holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
			}else{
				holder.find('.right-div').css("height","");
			}
		}
		
		var leftMenuPlaceHolder = masterContainer.find(".left-menu-placeholder");
		var menuRatio = $(window).width()/menu_layout.LEFT_MENU_WIDTH;
		if (menuPosition == "left" && menuRatio > 4){
			menuAlign = "center";
			masterContainer.addClass("left-menu-layout");
			holder.find(".preview-content-holder").css("height",$(window).height());
			if (leftMenuPlaceHolder.length == 0){
				leftMenuPlaceHolder = $("<div />").addClass("left-menu-placeholder");
				var holderHandle = holder.next(".control-handle");
				leftMenuPlaceHolder.append(holder);
				if (holderHandle.length > 0){
					leftMenuPlaceHolder.append(holderHandle);
				}
				$(".master.container > #children").before(leftMenuPlaceHolder);
			} 
		}else{
			masterContainer.removeClass("left-menu-layout");
			holder.find(".preview-content-holder").css("height","");
			masterContainer.find("#children").first().css("width","");
			menuPosition="top";
			if (leftMenuPlaceHolder.length != 0){
				var holderHandle = holder.next(".control-handle");
				$(".master.container > #children").prepend(holder);
				if (holderHandle.length > 0){
					holder.after(holderHandle);
				}
				
				leftMenuPlaceHolder.remove();
			}
		}
		
		if (menuAlign == "center"){
			holder.addClass("center-aligned-menu");
		}else{
			holder.removeClass("center-aligned-menu");
		}
		var previewTitle = currentItem.find(".preview-title");
		var previewSubtitle = currentItem.find(".preview-subtitle");
		var rightSideDiv = currentItem.find('.right-div');
		var leftSideDiv = currentItem.find('.left-div');
		leftSideDiv.find(".helper-div").show();
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length > 0 && currentItem.find(".element-placeholder[data-elementtype='SUBTITLE']").length > 0){
			currentItem.find(".helper-div").hide();
			if (currentItem.find(".element-placeholder[data-elementtype='ICON']").length > 0){
				menu_layout.centerifyLinks(leftSideDiv,rightSideDiv);
			}else{
				menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
			}
		}else{
			currentItem.find(".helper-div").show();
			menu_layout.uncenterifyLinks(leftSideDiv,rightSideDiv);
		}
		
		var stripe = container.closest(".master.item-box");
		
		var textElement = currentItem.find(".preview-title");
		var contentHolder = currentItem.find(".preview-content-holder");
		var contentWrapper = currentItem.find(".preview-content-wrapper");
		
		var originalFontSize = "N/A";
		if (currentItem.find(".element-placeholder[data-elementtype='TITLE']").length == 0){
			originalFontSize =  parseInt(leftSideDiv.attr("data-orig-font-size"));
			if (textElement.attr("data-orig-font-size")){
				if (originalFontSize != textElement.attr("data-orig-font-size")){
					originalFontSize = textElement.attr("data-orig-font-size");
				}
			}
			textElement.css("font-size",originalFontSize + "px");
		}
		
		var totalLinksWidth = 0;
		
		if (stripe.attr("data-original-menu-width") != "undefined"){
			totalLinksWidth = parseInt(stripe.attr("data-original-menu-width"));
			
		}else{
			totalLinksWidth = currentItem.find(".preview-item-links").outerWidth(true);
		}
		
		
		var textSpace = 0;
		if (leftSideDiv.length > 0){
			textSpace = parseInt(leftSideDiv.width());
		}
		
		var shrinkerRelevantContainer = contentWrapper;
		if (menuAlign == "center"){
			if (masterContainer.hasClass("left-menu-layout")){
				totalLinksWidth = 0; //(no shrink at all)
				shrinkerRelevantContainer = holder.find(".item-wrapper");
			}else{
				textSpace = 0; //(shrink and center)
			}
		}
		
		//Shrink if needed
		if (leftSideDiv.outerWidth(true) + totalLinksWidth > shrinkerRelevantContainer.width()){
			var newFontSize = SpimeEngine.shrinkTextToFit(originalFontSize,shrinkerRelevantContainer,leftSideDiv,textElement,totalLinksWidth,15);
			if (newFontSize != -1){
				textElement.css("font-size",newFontSize);
			}
		}
		
		alwaysMinify = alwaysMinify && menuAlign=="left" && menuPosition=="top";
		
		
		if ((contentHolder.width() < totalLinksWidth + textSpace || alwaysMinify) && menuPosition=="top"){
			//if shrink is not working menufyLinks
			menu_layout.menufyLinks(container,currentItem.find(".preview-item-links"));
			//if menufy is not enough remove text
			if (contentHolder.width() < textSpace + rightSideDiv.width()){
				//console.log("still NO space ");
				leftSideDiv.find(".helper-div").hide(); 
			}
		}else{
			if (!alwaysMinify){
				menu_layout.unmenufyLinks(container,container.next(".preview-item-links"));
				
			}
		}
		
		
		if (settings.attr("data-menu_overlay") == "absolute" && !holder.is(".being-scrolled")){
			holder.addClass("force-transparency");
			if (settings.attr("data-menu_overlay") == "absolute" && holder.css("position")!= "absolute"){
				 holder.css("position","absolute");
			}
		}
		if (settings.attr("data-menu_overlay") == "relative" && !holder.is(".being-scrolled")){
			if (settings.attr("data-menu_overlay") == "relative" && holder.css("position")!= "relative"){
				holder.css("position","relative");
				holder.removeClass("force-transparency");
			}
		}
	});
};

menu_layout.forceRedraw = function(elements){
	elements.each(function(){
		var element = $(this)[0];
		  var disp = element.style.display;
		  element.style.display = 'none';
		  var trick = element.offsetHeight;
		  element.style.display = disp;
	});
	
};

menu_layout.handleScroll = function(holder,scrollPos){
	if (holder.hasClass("is-blocked")){
		return;
	}
	var settings = holder.find(".layout-settings");
	var menuAlign = settings.attr("data-menu_align");
	var menuPosition = settings.attr("data-menu_position");
	if(holder.find(".item-wrapper").innerWidth() < 400 && menuPosition!="left"){
		menuAlign = "left";
		holder.addClass("force-min-height50 minimal-design");
	}else{
		holder.removeClass("minimal-design");
	}
	if (settings.attr("data-menu_scroll") == "true"){
		if (scrollPos == 0){
			$("#menu-placeholder").remove();
			if (menuAlign == "center"){
				holder.addClass("center-aligned-menu");
			}
			holder.css({"position":settings.attr("data-menu_overlay")});
			holder.removeClass("animated-top");
			holder.css("top","");
			//holder.find(".preview-subtitle-holder").show();
			holder.find('.left-div').removeClass("scale-down08");
			if (holder.find(".item-wrapper").innerWidth() >= 400){
				holder.removeClass("force-min-height50");
			}
			holder.removeClass("being-scrolled");
			if (!holder.is(".menufied")){
				holder.find('.right-div').css("height","");
			}
			if (settings.attr("data-menu_overlay") == "absolute"){
				holder.addClass("force-transparency");
			}
			menu_layout.forceRedraw(holder.find(".item-wrapper"))
		}else if(scrollPos < holder.outerHeight(true)){
			//console.log("still seen")
			//if(typeof window["EditorHelper"] != "undefined"){
				//if (holder.is(".being-scrolled")){
				//	holder.css("top",scrollPos);
				//}
			//}
			
		}else{
			if (holder.css("position") != "fixed" ){
				//Create a menu place holder to prevent the mobile scroll jump
				var menuHeight = parseInt(holder.css("height"));
				if (holder.parent().find("#menu-placeholder").length == 0 && !holder.is(".force-transparency")){
					var menuPlaceHolder = $("<div />").attr("id","menu-placeholder").css({"height":menuHeight,"width":"100%"});
					holder.after(menuPlaceHolder);
				}
				//holder.attr("data-orig-min-height", holder.css("min-height"));
				holder.removeClass("center-aligned-menu");
				holder.addClass("being-scrolled");
				holder.addClass("force-min-height50");
				holder.css({"position":"fixed","top":menuHeight*-1,"left":"0px"});
				holder.find('.left-div').addClass("scale-down08");
				holder.find('.right-div').css("height",holder.find('.left-div').height());
				//holder.find(".preview-subtitle-holder").hide();
				holder.addClass("animated-top");
				holder.removeClass("force-transparency");
				setTimeout(function(){
					var offsetFix = 0;
					//if(typeof window["EditorHelper"] != "undefined"){
						//offsetFix = scrollPos;
//						if ($(".site-thumb").lenght > 0){
//							offsetFix = 0;
//						}
					//}
					holder.css("top",offsetFix);	
				},10);
			}else{
				//if(typeof window["EditorHelper"] != "undefined" ){
				//	holder.removeClass("animated-top");
			//	holder.css("top",scrollPos);
				//}
			}
		}
	}
	
};

menu_layout.menufyLinks = function(container,linksHolder){
	var holder = container.closest(".master.item-box");
	var settings = holder.find(".layout-settings");
	var linksColor = linksHolder.find(".item-link").css("color");
	var menuBtn = container.find(".links-menu-btn");
	menuBtn.children().css("background-color",linksColor);
	menuBtn.addClass("shown");
	//menuBtn.css("display","table-cell");
	if (container.next(".preview-item-links").length == 0){
		var allLinks = linksHolder.children();
		var menuBackground = container.find(".item-content").css("background-color");
		var menuMaxWidth = container.css("max-width");
		allLinks.addClass("flipped");
		holder.addClass("menufied");
		//linksHolder.find("span").css({"display":"block","margin-right":"auto","margin-left":"auto"});
		linksHolder.css({"max-width":menuMaxWidth,"background-color":menuBackground});
		linksHolder.hide();
		container.after(linksHolder);
		var stripe = container.closest(".master.item-box");
		stripe.attr("data-original-stripe-height" , stripe.height());
		
		
		menuBtn.unbind('click').bind('click', function(e){
			e.stopPropagation();
			stripe.addClass("animated");
			$(this).toggleClass("clicked");
			if ($(this).hasClass("clicked")){
				holder.removeClass("force-transparency");
				linksHolder.addClass("flipped");
				container.find(".item-content").addClass("flipped");
				linksHolder.slideDown();
			}else{
				linksHolder.hide();
				if (settings.attr("data-menu_overlay") == "absolute" && !holder.is(".being-scrolled")){
					holder.addClass("force-transparency");
				}
				linksHolder.removeClass("flipped");
			}
		});
		//if (holder.find('.left-div').height() > holder.find('.right-div').height()){
			holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
		//}
	}
};

menu_layout.unmenufyLinks = function(container,linksHolder){
	var holder = container.closest(".master.item-box");
	if (container.next(".preview-item-links").length > 0){
		var menuLinksHolder = linksHolder.find(".menu-links-holder");
		//linksHolder.find("span").css({"display":"","margin-right":"","margin-left":""});
		linksHolder.css({"max-width":"","background-color":"","margin":""});
		holder.removeClass("menufied");
		//linksHolder.find(".links-menu-btn").removeClass("shown");
		container.find(".links-menu-btn").removeClass("shown");
		var allLinks = menuLinksHolder.children();
		allLinks.removeClass("flipped");
		container.find(".item-content").removeClass("flipped");
		linksHolder.append(allLinks);
		container.find(".right-div").prepend(linksHolder);
		var stripe = container.closest(".master.item-box");
		stripe.removeClass("animated");
		linksHolder.show();
		linksHolder.removeClass("flipped");
		//holder.find('.right-div').css("height","");
		holder.find(".preview-item-links").css("display","");
		holder.find('.right-div').css("height",holder.find('.preview-icon-holder').height());
	}

};



!function(i){"function"==typeof define&&define.amd?define(["jquery"],function(t){i(t,window,document)}):"object"==typeof module&&module.exports?module.exports=i(require("jquery"),window,document):i(jQuery,window,document)}(function(l,r,t,o){"use strict";var s="intlTelInput",e=1,n={allowDropdown:!0,autoHideDialCode:!0,autoPlaceholder:"polite",customPlaceholder:null,dropdownContainer:"",excludeCountries:[],formatOnDisplay:!0,geoIpLookup:null,initialCountry:"",nationalMode:!0,onlyCountries:[],placeholderNumberType:"MOBILE",preferredCountries:["us","gb"],separateDialCode:!1,utilsScript:""},u=38,h=40,d=13,c=27,i=43,p=65,f=90,g=32,a=9,C=["800","822","833","844","855","866","877","880","881","882","883","884","885","886","887","888","889"];function y(t,i){this.telInput=l(t),this.options=l.extend({},n,i),this.ns="."+s+e++,this.isGoodBrowser=Boolean(t.setSelectionRange),this.hadInitialPlaceholder=Boolean(l(t).attr("placeholder"))}l(r).on("load",function(){l.fn[s].windowLoaded=!0}),y.prototype={_init:function(){return this.options.nationalMode&&(this.options.autoHideDialCode=!1),this.options.separateDialCode&&(this.options.autoHideDialCode=this.options.nationalMode=!1),this.isMobile=/Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.isMobile&&(l("body").addClass("iti-mobile"),this.options.dropdownContainer||(this.options.dropdownContainer="body")),this.autoCountryDeferred=new l.Deferred,this.utilsScriptDeferred=new l.Deferred,this.selectedCountryData={},this._processCountryData(),this._generateMarkup(),this._setInitialState(),this._initListeners(),this._initRequests(),[this.autoCountryDeferred,this.utilsScriptDeferred]},_processCountryData:function(){this._processAllCountries(),this._processCountryCodes(),this._processPreferredCountries()},_addCountryCode:function(t,i,e){i in this.countryCodes||(this.countryCodes[i]=[]);var n=e||0;this.countryCodes[i][n]=t},_processAllCountries:function(){if(this.options.onlyCountries.length){var i=this.options.onlyCountries.map(function(t){return t.toLowerCase()});this.countries=m.filter(function(t){return-1<i.indexOf(t.iso2)})}else if(this.options.excludeCountries.length){var e=this.options.excludeCountries.map(function(t){return t.toLowerCase()});this.countries=m.filter(function(t){return-1===e.indexOf(t.iso2)})}else this.countries=m},_processCountryCodes:function(){this.countryCodes={};for(var t=0;t<this.countries.length;t++){var i=this.countries[t];if(this._addCountryCode(i.iso2,i.dialCode,i.priority),i.areaCodes)for(var e=0;e<i.areaCodes.length;e++)this._addCountryCode(i.iso2,i.dialCode+i.areaCodes[e])}},_processPreferredCountries:function(){this.preferredCountries=[];for(var t=0;t<this.options.preferredCountries.length;t++){var i=this.options.preferredCountries[t].toLowerCase(),e=this._getCountryData(i,!1,!0);e&&this.preferredCountries.push(e)}},_generateMarkup:function(){this.telInput.attr("autocomplete","off");var t="intl-tel-input";this.options.allowDropdown&&(t+=" allow-dropdown"),this.options.separateDialCode&&(t+=" separate-dial-code"),this.telInput.wrap(l("<div>",{class:t})),this.flagsContainer=l("<div>",{class:"flag-container"}).insertBefore(this.telInput);var i=l("<div>",{class:"selected-flag"});i.appendTo(this.flagsContainer),this.selectedFlagInner=l("<div>",{class:"iti-flag"}).appendTo(i),this.options.separateDialCode&&(this.selectedDialCode=l("<div>",{class:"selected-dial-code"}).appendTo(i)),this.options.allowDropdown?(i.attr("tabindex","0"),l("<div>",{class:""}).appendTo(i),this.countryList=l("<ul>",{class:"country-list hide"}),this.preferredCountries.length&&(this._appendListItems(this.preferredCountries,"preferred"),l("<li>",{class:"divider"}).appendTo(this.countryList)),this._appendListItems(this.countries,""),this.countryListItems=this.countryList.children(".country"),this.options.dropdownContainer?this.dropdown=l("<div>",{class:"intl-tel-input iti-container"}).append(this.countryList):this.countryList.appendTo(this.flagsContainer)):this.countryListItems=l()},_appendListItems:function(t,i){for(var e="",n=0;n<t.length;n++){var a=t[n];e+="<li class='country "+i+"' data-dial-code='"+a.dialCode+"' data-country-code='"+a.iso2+"'>",e+="<div class='flag-box'><div class='iti-flag "+a.iso2+"'></div></div>",e+="<span class='country-name'>"+a.name+"</span>",e+="<span class='dial-code'>+"+a.dialCode+"</span>",e+="</li>"}this.countryList.append(e)},_setInitialState:function(){var t=this.telInput.val();this._getDialCode(t)&&!this._isRegionlessNanp(t)?this._updateFlagFromNumber(t):"auto"!==this.options.initialCountry&&(this.options.initialCountry?this._setFlag(this.options.initialCountry.toLowerCase()):(this.defaultCountry=this.preferredCountries.length?this.preferredCountries[0].iso2:this.countries[0].iso2,t||this._setFlag(this.defaultCountry)),t||this.options.nationalMode||this.options.autoHideDialCode||this.options.separateDialCode||this.telInput.val("+"+this.selectedCountryData.dialCode)),t&&this._updateValFromNumber(t)},_initListeners :function(){this._initKeyListeners(),this.options.autoHideDialCode&&this._initFocusListeners(),this.options.allowDropdown&&this._initDropdownListeners()},_initDropdownListeners:function(){var i=this,t=this.telInput.closest("label");t.length&&t.on("click"+this.ns,function(t){i.countryList.hasClass("hide")?i.telInput.focus():t.preventDefault()}),this.selectedFlagInner.parent().on("click"+this.ns,function(t){!i.countryList.hasClass("hide")||i.telInput.prop("disabled")||i.telInput.prop("readonly")||i._showDropdown()}),this.flagsContainer.on("keydown"+i.ns,function(t){!i.countryList.hasClass("hide")||t.which!=u&&t.which!=h&&t.which!=g&&t.which!=d||(t.preventDefault(),t.stopPropagation(),i._showDropdown()),t.which==a&&i._closeDropdown()})},_initRequests:function(){var t=this;this.options.utilsScript?l.fn[s].windowLoaded?l.fn[s].loadUtils(this.options.utilsScript,this.utilsScriptDeferred):l(r).on("load",function(){l.fn[s].loadUtils(t.options.utilsScript,t.utilsScriptDeferred)}):this.utilsScriptDeferred.resolve(),"auto"===this.options.initialCountry?this._loadAutoCountry():this.autoCountryDeferred.resolve()},_loadAutoCountry:function(){l.fn[s].autoCountry?this.handleAutoCountry():l.fn[s].startedLoadingAutoCountry||(l.fn[s].startedLoadingAutoCountry=!0,"function"==typeof this.options.geoIpLookup&&this.options.geoIpLookup(function(t){l.fn[s].autoCountry=t.toLowerCase(),setTimeout(function(){l(".intl-tel-input input").intlTelInput("handleAutoCountry")})}))},_initKeyListeners:function(){var t=this;this.telInput.on("keyup"+this.ns,function(){t._updateFlagFromNumber(t.telInput.val())&&t._triggerCountryChange()}),this.telInput.on("cut"+this.ns+" paste"+this.ns,function(){setTimeout(function(){t._updateFlagFromNumber(t.telInput.val())&&t._triggerCountryChange()})})},_cap:function(t){var i=this.telInput.attr("maxlength");return i&&t.length>i?t.substr(0,i):t},_initFocusListeners:function(){var e=this;this.telInput.on("mousedown"+this.ns,function(t){e.telInput.is(":focus")||e.telInput.val()||(t.preventDefault(),e.telInput.focus())}),this.telInput.on("focus"+this.ns,function(t){e.telInput.val()||e.telInput.prop("readonly")||!e.selectedCountryData.dialCode||(e.telInput.val("+"+e.selectedCountryData.dialCode),e.telInput.one("keypress.plus"+e.ns,function(t){t.which==i&&e.telInput.val("")}),setTimeout(function(){var t=e.telInput[0];if(e.isGoodBrowser){var i=e.telInput.val().length;t.setSelectionRange(i,i)}}))});var t=this.telInput.prop("form");t&&l(t).on("submit"+this.ns,function(){e._removeEmptyDialCode()}),this.telInput.on("blur"+this.ns,function(){e._removeEmptyDialCode()})},_removeEmptyDialCode:function(){var t=this.telInput.val();if("+"==t.charAt(0)){var i=this._getNumeric(t);i&&this.selectedCountryData.dialCode!=i||this.telInput.val("")}this.telInput.off("keypress.plus"+this.ns)},_getNumeric:function(t){return t.replace(/\D/g,"")},_showDropdown:function(){this._setDropdownPosition();var t=this.countryList.children(".active");t.length&&(this._highlightListItem(t),this._scrollTo(t)),this._bindDropdownListeners(),this.selectedFlagInner.children(".iti-arrow").addClass("up")},_setDropdownPosition:function(){var t=this;if(this.options.dropdownContainer&&this.dropdown.appendTo(this.options.dropdownContainer),this.dropdownHeight=this.countryList.removeClass("hide").outerHeight(),!this.isMobile){var i=this.telInput.offset(),e=i.top,n=l(r).scrollTop(),a=e+this.telInput.outerHeight()+this.dropdownHeight<n+l(r).height(),o=e-this.dropdownHeight>n;if(this.countryList.toggleClass("dropup",!a&&o),this.options.dropdownContainer){var s=!a&&o?0:this.telInput.innerHeight();this.dropdown.css({top:e+s,left:i.left}),l(r).on("scroll"+this.ns,function(){t._closeDropdown()})}}},_bindDropdownListeners:function(){var i=this;this.countryList.on("mouseover"+this.ns,".country",function(t){i._highlightListItem(l(this))}),this.countryList.on("click"+this.ns,".country",function(t){i._selectListItem(l(this))});var e=!0;l("html").on("click"+this.ns,function(t){e||i._closeDropdown(),e=!1});var n="",a=null;l(t).on("keydown"+this.ns,function(t){t.preventDefault(),t.which==u||t.which==h?i._handleUpDownKey(t.which):t.which==d?i._handleEnterKey():t.which==c?i._closeDropdown():(t.which>=p&&t.which<=f||t.which==g)&&(a&&clearTimeout(a),n+=String.fromCharCode(t.which),i._searchForCountry(n),a=setTimeout(function(){n=""},1e3))})},_handleUpDownKey:function(t){var i=this.countryList.children(".highlight").first(),e=t==u?i.prev():i.next();e.length&&(e.hasClass("divider")&&(e=t==u?e.prev():e.next()),this._highlightListItem(e),this._scrollTo(e))},_handleEnterKey:function(){var t=this.countryList.children(".highlight").first();t.length&&this._selectListItem(t)},_searchForCountry:function(t){for(var i=0;i<this.countries.length;i++)if(this._startsWith(this.countries[i].name,t)){var e=this.countryList.children("[data-country-code="+this.countries[i].iso2+"]").not(".preferred");this._highlightListItem(e),this._scrollTo(e,!0);break}},_startsWith:function(t,i){return t.substr(0,i.length).toUpperCase()==i},_updateValFromNumber:function(t){if(this.options.formatOnDisplay&&r.intlTelInputUtils&&this.selectedCountryData){var i=this.options.separateDialCode||!this.options.nationalMode&&"+"==t.charAt(0)?intlTelInputUtils.numberFormat.INTERNATIONAL:intlTelInputUtils.numberFormat.NATIONAL;t=intlTelInputUtils.formatNumber(t,this.selectedCountryData.iso2,i)}t=this._beforeSetNumber(t),this.telInput.val(t)},_updateFlagFromNumber:function(t){t&&this.options.nationalMode&&"1"==this.selectedCountryData.dialCode&&"+"!=t.charAt(0)&&("1"!=t.charAt(0)&&(t="1"+t),t="+"+t);var i=this._getDialCode(t),e=null,n=this._getNumeric(t);if(i){var a=this.countryCodes[this._getNumeric(i)],o=-1<l.inArray(this.selectedCountryData.iso2,a),s="+1"==i&&4<=n.length;if((!("1"==this.selectedCountryData.dialCode)||!this._isRegionlessNanp(n))&&(!o||s))for(var r=0;r<a.length;r++)if(a[r]){e=a[r];break}}else"+"==t.charAt(0)&&n.length?e="":t&&"+"!=t||(e=this.defaultCountry);return null!==e&&this._setFlag(e)},_isRegionlessNanp:function(t){var i=this._getNumeric(t);if("1"==i.charAt(0)){var e=i.substr(1,3);return-1<l.inArray(e,C)}return!1},_highlightListItem:function(t){this.countryListItems.removeClass("highlight"),t.addClass("highlight")},_getCountryData:function(t,i,e){for(var n=i?m:this.countries,a=0;a<n.length;a++)if(n[a].iso2==t)return n[a];if(e)return null;throw new Error("No country data for '"+t+"'")},_setFlag:function(t){var i=this.selectedCountryData.iso2?this.selectedCountryData:{};this.selectedCountryData=t?this._getCountryData(t,!1,!1):{},this.selectedCountryData.iso2&&(this.defaultCountry=this.selectedCountryData.iso2),this.selectedFlagInner.attr("class","iti-flag "+t);var e=t?this.selectedCountryData.name+": +"+this.selectedCountryData.dialCode:"Unknown";if(this.selectedFlagInner.parent().attr("title",e),this.options.separateDialCode){var n=this.selectedCountryData.dialCode?"+"+this.selectedCountryData.dialCode:"",a=this.telInput.parent();i.dialCode&&a.removeClass("iti-sdc-"+(i.dialCode.length+1)),n&&a.addClass("iti-sdc-"+n.length),this.selectedDialCode.text(n)}return this._updatePlaceholder(),this.countryListItems.removeClass("active"),t&&this.countryListItems.find(".iti-flag."+t).first().closest(".country").addClass("active"),i.iso2!==t},_updatePlaceholder:function(){var t="aggressive"===this.options.autoPlaceholder||!this.hadInitialPlaceholder&&(!0===this.options.autoPlaceholder||"polite"===this.options.autoPlaceholder);if(r.intlTelInputUtils&&t){var i=intlTelInputUtils.numberType[this.options.placeholderNumberType],e=this.selectedCountryData.iso2?intlTelInputUtils.getExampleNumber(this.selectedCountryData.iso2,this.options.nationalMode,i):"";e=this._beforeSetNumber(e),"function"==typeof this.options.customPlaceholder&&(e=this.options.customPlaceholder(e,this.selectedCountryData)),this.telInput.attr("placeholder",e)}},_selectListItem:function(t){var i=this._setFlag(t.attr("data-country-code"));if(this._closeDropdown(),this._updateDialCode(t.attr("data-dial-code"),!0),this.telInput.focus(),this.isGoodBrowser){var e=this.telInput.val().length;this.telInput[0].setSelectionRange(e,e)}i&&this._triggerCountryChange()},_closeDropdown:function(){this.countryList.addClass("hide"),this.selectedFlagInner.children(".iti-arrow").removeClass("up"),l(t).off(this.ns),l("html").off(this.ns),this.countryList.off(this.ns),this.options.dropdownContainer&&(this.isMobile||l(r).off("scroll"+this.ns),this.dropdown.detach())},_scrollTo:function(t,i){var e=this.countryList,n=e.height(),a=e.offset().top,o=a+n,s=t.outerHeight(),r=t.offset().top,l=r+s,u=r-a+e.scrollTop(),h=n/2-s/2;if(r<a)i&&(u-=h),e.scrollTop(u);else if(o<l){i&&(u+=h);var d=n-s;e.scrollTop(u-d)}},_updateDialCode:function(t,i){var e,n=this.telInput.val();if(t="+"+t,"+"==n.charAt(0)){var a=this._getDialCode(n);e=a?n.replace(a,t):t}else{if(this.options.nationalMode||this.options.separateDialCode)return;if(n)e=t+n;else{if(!i&&this.options.autoHideDialCode)return;e=t}}this.telInput.val(e)},_getDialCode:function(t){var i="";if("+"==t.charAt(0))for(var e="",n=0;n<t.length;n++){var a=t.charAt(n);if(l.isNumeric(a)&&(e+=a,this.countryCodes[e]&&(i=t.substr(0,n+1)),4==e.length))break}return i},_getFullNumber:function(){var t=l.trim(this.telInput.val()),i=this.selectedCountryData.dialCode,e=this._getNumeric(t),n="1"==e.charAt(0)?e:"1"+e;return(this.options.separateDialCode?"+"+i:"+"!=t.charAt(0)&&"1"!=t.charAt(0)&&i&&"1"==i.charAt(0)&&4==i.length&&i!=n.substr(0,4)?i.substr(1):"")+t},_beforeSetNumber:function(t){if(this.options.separateDialCode){var i=this._getDialCode(t);if(i){null!==this.selectedCountryData.areaCodes&&(i="+"+this.selectedCountryData.dialCode);var e=" "===t[i.length]||"-"===t[i.length]?i.length+1:i.length;t=t.substr(e)}}return this._cap(t)},_triggerCountryChange:function(){this.telInput.trigger("countrychange",this.selectedCountryData)},handleAutoCountry:function(){"auto"===this.options.initialCountry&&(this.defaultCountry=l.fn[s].autoCountry,this.telInput.val()||this.setCountry(this.defaultCountry),this.autoCountryDeferred.resolve())},handleUtils:function(){r.intlTelInputUtils&&(this.telInput.val()&&this._updateValFromNumber(this.telInput.val()),this._updatePlaceholder()),this.utilsScriptDeferred.resolve()},destroy:function(){if(this.allowDropdown&&(this._closeDropdown(),this.selectedFlagInner.parent().off(this.ns),this.telInput.closest("label").off(this.ns)),this.options.autoHideDialCode){var t=this.telInput.prop("form");t&&l(t).off(this.ns)}this.telInput.off(this.ns),this.telInput.parent().before(this.telInput).remove()},getExtension:function(){return r.intlTelInputUtils?intlTelInputUtils.getExtension(this._getFullNumber(),this.selectedCountryData.iso2):""},getNumber:function(t){return r.intlTelInputUtils?intlTelInputUtils.formatNumber(this._getFullNumber(),this.selectedCountryData.iso2,t):""},getNumberType:function(){return r.intlTelInputUtils?intlTelInputUtils.getNumberType(this._getFullNumber(),this.selectedCountryData.iso2):-99},getSelectedCountryData:function(){return this.selectedCountryData},getValidationError:function(){return r.intlTelInputUtils?intlTelInputUtils.getValidationError(this._getFullNumber(),this.selectedCountryData.iso2):-99},isValidNumber:function(){var t=l.trim(this._getFullNumber()),i=this.options.nationalMode?this.selectedCountryData.iso2:"";return r.intlTelInputUtils?intlTelInputUtils.isValidNumber(t,i):null},setCountry:function(t){t=t.toLowerCase(),this.selectedFlagInner.hasClass(t)||(this._setFlag(t),this._updateDialCode(this.selectedCountryData.dialCode,!1),this._triggerCountryChange())},setNumber:function(t){var i=this._updateFlagFromNumber(t);this._updateValFromNumber(t),i&&this._triggerCountryChange()}},l.fn[s]=function(e){var i,n=arguments;if(e===o||"object"==typeof e){var a=[];return this.each(function(){if(!l.data(this,"plugin_"+s)){var t=new y(this,e),i=t._init();a.push(i[0]),a.push(i[1]),l.data(this,"plugin_"+s,t)}}),l.when.apply(null,a)}if("string"==typeof e&&"_"!==e[0])return this.each(function(){var t=l.data(this,"plugin_"+s);t instanceof y&&"function"==typeof t[e]&&(i=t[e].apply(t,Array.prototype.slice.call(n,1))),"destroy"===e&&l.data(this,"plugin_"+s,null)}),i!==o?i:this},l.fn[s].getCountryData=function(){return m},l.fn[s].loadUtils=function(t,i){l.fn[s].loadedUtilsScript?i&&i.resolve():(l.fn[s].loadedUtilsScript=!0,l.ajax({type:"GET",url:t,complete:function(){l(".intl-tel-input input").intlTelInput("handleUtils")},dataType:"script",cache:!0}))},l.fn[s].defaults=n,l.fn[s].version="11.0.10";for(var m=[["Colombia","co","57"]],v=0;v<m.length;v++){var I=m[v];m[v]={name:I[0],iso2:I[1],dialCode:I[2],priority:I[3]||0,areaCodes:I[4]||null}}});
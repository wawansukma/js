jQuery(document).ready(function() {
    if (typeof ($("#mainform")[0]) != "undefined") $("#mainform")[0].reset();
    
    var shortUrls = {
        
        // config
        config: {
            msgValidDomain: 'Write a valid url!',
            msgCustom: 'Custom name already taken!'
        },
        
        // main form
        mainform: $(this).find('#mainform'),
        
        // init function 
        init: function(config){
         $.extend(this.config,config);
         var myUrl = this.mainform.children('#url'),
             myButton = this.mainform.children('#submit'),
             myTooltip = this.mainform.children('#qrCode').children('.qrTooltip');
            $(myUrl).focus().on('paste', function() {
                setTimeout(function () { 
                    if(shortUrls.validate.call()){
                       myButton.click();     
                    } 
                }, 100);
            });                
         $(myUrl).on('click',function(){
            if (myUrl.hasClass('isNew')){
                if(myTooltip.is(':hidden')){
                    myTooltip.fadeIn(300);
                }
                $(myUrl).on('change',function(){
                   myUrl.removeClass('isNew'); 
                });
                shortUrls.selectText(this);
            }
         });
         $(this.mainform.children('#submit'))  
                .on('click', function(e){
                    e.preventDefault();
                    shortUrls.showMessage('');
                    if (myUrl.hasClass('isNew')){
                        if(myTooltip.is(':hidden')){
                            myTooltip.fadeIn(300);
                        }
                    };                  
                   if(shortUrls.validate.call()){
                        $(myButton).attr('disabled', true);
                        shortUrls.send.call();
                    }
                });         
        },
        
        // validate
        validate: function (){
            var url = $.trim(shortUrls.mainform.children('#url').val()),
                matches = url.match(/^((http|https):\/\/)?([^\/?#]+)(?:[\/?#]|$)/i),
                domain = matches && matches[3];
            if (domain!=document.domain){
                if (/^((https?|ftp):\/\/)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
                    return true;    
                }
                shortUrls.showMessage(shortUrls.config.msgValidDomain);
            }
            shortUrls.selectText('#url');
            return false;
        },        
        
        // select text
        selectText:function(div){
           $(div).focus().select();
        },
        
        // show messages
        showMessage:function(msg){
            var myMessage = $('#info p'),
                myUrl =  shortUrls.mainform.children('#url'),
                myTooltip = shortUrls.mainform.find('#qrCode').children('.qrTooltip');
            if(msg!=''){
                if(myUrl.hasClass('isNew')){
                    myUrl.removeClass('isNew');
                }
                myTooltip.hide();
                myMessage.text(msg).fadeIn(150);
                return;    
            }
            myMessage.text('').hide();
        },
        
        // send
        send: function(){
            var myData = shortUrls.mainform,
                myAction = myData.attr('action'),
                myUrl = myData.children('#url'),
                myCustom = myData.children('#tools').children('#custom'),
                myPassword = myData.children('#tools').children('#password'),
                myUses = myData.children('#tools').children('#uses'),
                myExpire = myData.children('#tools').children('#expire'),
                myPrivate = myData.children('#tools').children('span').children('#private'),
                myButton = myData.children('#submit'),
                myTooltip = myData.find('#qrCode').children('.qrTooltip'),
                myQrCode, myMsg;
    		$.ajax({
    			type: 'post',
    			url: myAction,
    			data: {
    				url: myUrl.val(),
                    custom: myCustom.val(),
                    password: myPassword.val(),
                    uses: myUses.val(),
                    expire: myExpire.val(),
                    is_private: myPrivate.is(':checked'),
                    via: 'web'
    			},
    			dataType: 'json',
                beforeSend:function(){
                    myButton.removeClass('normal').addClass('loading');
                },
    			success: function(response) {
    			    myButton.removeClass('loading').addClass('normal');
                    $(myButton).attr('disabled', false);
    				if (response.success === true) {
                       if (response.data.status == 'custom-taken'){
                            myMsg = shortUrls.config.msgCustom;
                            myCustom.focus();
                       } else {
        					$(myUrl).val(response.data.url)
                                    .addClass('isNew');
                            shortUrls.selectText(myUrl);    
                            myQrCode = 'http://chart.apis.google.com/chart?cht=qr&chs=100x100&chl='+response.data.url+'&chld=L|0';
                            myTooltip.css('backgroundImage','url('+myQrCode+')')
                                     .fadeIn(300)
                                     .end()
                                     .on('click',function(){
                                       document.location.href= response.data.url+'.qrcode?download';
                                     });
                            myMsg = '';        
                       }                        
                       $(myCustom).val('');
    				} else {
                        myMsg = response.error.msg;
    				}
                   shortUrls.showMessage(myMsg);
    			},
                error: function (data){
                        alert('something goes wrong... reloading');
                        window.location.reload();
                }
    		});
        }    
    }; 
    
    // run
    shortUrls.init();
    
    // custom
    $('#tools').hide();
    $('#custom_link').on('click',function(e){
        e.preventDefault();
        $('#tools').val('').toggle(function(){
            $('#custom, #password, #uses, #expire').val('');
            if($(this).is(':visible')){
                $('#custom').focus();
            }
        });
    });
    
    // date picker
    $('#expire').datepick({
        minDate: +1,
        showAnim: '',
    });    
    
    // private checkbox
	$(".checkbox").on('click', function(){
		if($(this).children("input").attr("checked")){
			$(this).children('label').text('public');
			$(this).children("input").attr({checked: false});
			$(this).removeClass("checked").addClass("unchecked");
		}else{
            $(this).children('label').text('private');
			$(this).children("input").attr({checked: "checked"});
			$(this).removeClass("unchecked").addClass("checked");
		}
	});

});

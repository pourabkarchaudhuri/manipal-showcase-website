'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(["utils", "settings", "handlebars", 'jquery'], function (utils, settings, handlebars, $) {
    var methods = {};
    handlebars.getTemplate = function (name) {
        if (handlebars.templates === undefined || handlebars.templates[name] === undefined) {
            $.ajax({
                url: 'templates/' + name + '.hbs',
                success: function (data) {
                    if (handlebars.templates === undefined) {
                        handlebars.templates = {};
                    }
                    handlebars.templates[name] = handlebars.compile(data);
                },
                async: false
            });
        }
        return handlebars.templates[name];
    };
    handlebars.registerHelper('if_eq', function (a, b, opts) {
        if (a == b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    });
    handlebars.registerHelper('consol', function (context) {
        console.log(context);
    });
    handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    handlebars.registerHelper('toString', function (context) {
        return context.toString();
    });
    handlebars.registerHelper("key_value", function (obj, opts) {
        var soFar = "";
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                return opts.fn(this);
            }
            else {
                return opts.inverse(this);
            }
        }

    });
    handlebars.registerHelper('each_hash', function (context, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";

        if (typeof context === "object") {
            for (var key in context) {
                if (context.hasOwnProperty(key)) {
                    // clone the context so it's not
                    // modified by the template-engine when
                    // setting "_key"
                    var ctx = jQuery.extend(
                        { "_key": key },
                        context[key]);

                    ret = ret + fn(ctx);
                }
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    });
    //User Plain Text
    methods.userplaintext = (data) => {
        var compiledTemplate = handlebars.getTemplate('userplaintext');
        let html = compiledTemplate(data);
        return html;
    }

    //Plain Text Template
    methods.plaintext = (data) => {
        var compiledTemplate = handlebars.getTemplate('plaintext');
        let html = compiledTemplate(data);
        return html;
    }
    //Card Template
    methods.card = (data) => {
        var compiledTemplate = handlebars.getTemplate('card');
        let html = compiledTemplate(data);
        return html;
    }
    methods.quickreplies = (data) => {
        var compiledTemplate = handlebars.getTemplate('quickreply');
        let html = compiledTemplate(data);
        return html;
    }

    methods.quickrepliesimg = (data) => {
        var compiledTemplate = handlebars.getTemplate('quickreplyimg');
        let html = compiledTemplate(data);
        return html;
    }

    methods.carousel = (data, uniqueId) => {
        var compiledTemplate = handlebars.getTemplate('carousel');
        data["uniqueId"] = uniqueId;
        let html = compiledTemplate(data);
        return html;
    }

    methods.quickrepliesfromapiai = (data) => {
        var quickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body animated fadeInLeft"><img width="35" height="35" class="bot-logo-image" style="border:none;">`;

        for (let i in data.payload) {


            if (data.payload[i].platform == "facebook") {
                console.log('QR ----------- ',data.payload[i]);
                if(data.payload[i].type == 0) {
                    let html = `<li class="animated fadeInLeft list-group-item background-color-custom">
        <table border="0" cellpadding="0" cellspacing="0">
        <tr>
        <td style="vertical-align:top;">
            <img width="35" height="35" class="bot-logo-image" style="border:none;" /></td>
            <td><div class="media-body bot-txt-space">
                <p class="list-group-item-text-bot">${data.payload[i].speech}</p>
                <p class="bot-res-timestamp"><small> <img style="border-radius:50%;border:2px solid white;" class="welcome-message" width="20" height="20"/>${data.time}</small></p>

            </div></td>
            </tr>
        </table>


        </li>`;

                }
                else {
                    quickRepliesHtml += `<p class="list-group-item-quick-reply-space">${data.payload[i].payload.facebook.text}</p><div class="quick-replies-buttons">`;
                    for (var j = 0; j < data.payload[i].payload.facebook.quick_replies.length; j++) {
                        if (data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('payload')) {
                            console.log('payload for qr ----- ',data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('payload'));
                            console.log('payload for qr val ----- ',data.payload[i].payload.facebook.quick_replies[j].payload);
                            console.log('payload for qr title ----- ',data.payload[i].payload.facebook.quick_replies[j].title);
                            quickRepliesHtml += `<button type="button" class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload btn-img" data-quickRepliesPayload="${data.payload[i].payload.facebook.quick_replies[j].payload}"><img src="http://placehold.it/30x30" width="30" height="30"/><span>${data.payload[i].payload.facebook.quick_replies[j].title}</span></button>`
                        }
                        else if (data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('url')) {
                            console.log("URL : " + data.payload[i].payload.facebook.quick_replies[j].url);
                            quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" onClick="window.location.href='${data.payload[i].payload.facebook.quick_replies[j].url}'; 'height=400,width=600'" >${data.payload[i].payload.facebook.quick_replies[j].title}</button>`

                        }
                        else if (data.payload[i].payload.facebook.quick_replies[j].hasOwnProperty('tab')) {
                            console.log("TAB : " + data.payload[i].payload.facebook.quick_replies[j].tab);
                            quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" onClick="window.open('${data.payload[i].payload.facebook.quick_replies[j].tab}','_blank'); " >${data.payload[i].payload.facebook.quick_replies[j].title}</button>`
                        }
                    }
                }
          }
        }
        quickRepliesHtml += `</div><p class="bot-res-timestamp-qr"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" class="welcome-message"/>${data.time}</small></p></div></li>`
        return quickRepliesHtml;
        // var apiquickRepliesHtml = `<li class="list-group-item background-color-custom">
        // <div class="media-body animated fadeInLeft">`
        // let qReply;
        // if (data.payload) {
        //     qReply = data.payload;
        // } else {
        //     qReply = data;
        // }

        // for (let i in qReply) {
        //     if (qReply[i].platform == "facebook" && qReply[i].type == "2") {
        //         if (data.responseIndex) {
        //             apiquickRepliesHtml += `<img style="border-radius:50%;border:2px solid white;float: left;margin-right: 10px;" width="40" height="40" src='${settings.botAvatar}'/>`
        //             if (qReply[i].title.trim().length) {
        //                 apiquickRepliesHtml += `<p class="list-group-item-quick-reply-space beforeAfter">${qReply[i].title}</p>`
        //             }
        //         } else {
                   
        //             if (qReply[i].title.trim().length) {
        //                 apiquickRepliesHtml += `<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/><p class="list-group-item-quick-reply-space">${qReply[i].title}</p>`
        //             }

        //         }
               

        //         if (qReply[i].replies.indexOf("Buisness") != -1) {
        //             apiquickRepliesHtml += `<div class="quick-replies-buttons" style="display: -webkit-inline-box;">`
        //             for (let j = 0; j < qReply[i].replies.length; j++) {
        //                 qReply[i].replies.sort();
        //                     //apiquickRepliesHtml += `<button type="button"  class="btn btn-quick .pmd-btn-fab apiQuickreplybtnPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}"><img src="images/Query/${qReply[i].replies[j].replace(/ /g, '')}.svg" class="img-responsive quick-reply-icon"></button><div class="quick-reply-button-text" style="padding-left: 5px !important;">${qReply[i].replies[j]}</div></button>`
        //                     apiquickRepliesHtml += `<ul style="list-style-type: none;"><li><button type="button"  class="btn-quick .pmd-btn-fab apiquickRepliesPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}"><img src="avatar/image/${qReply[i].replies[j].replace(/ /g, '')}.svg" style="max-width:none !important;" class="img-responsive quick-reply-icon"></button></li><li><div class="quick-reply-button-text" style="padding-left: 5px !important;">${qReply[i].replies[j]}</div></li></ul>`
        //                     //<br><div class="quick-reply-button-text" style="display:block !important;text-align:left">${qReply[i].replies[j]}</div>
        //             }
        //         } 
        //             else if(qReply[i].replies.indexOf("Self Quotes") != -1) {
        //                 apiquickRepliesHtml += `<div class="quick-replies-Cash">`
        //                 for (let j = 0; j < qReply[i].replies.length; j++) {
        //                         apiquickRepliesHtml +=  `<ul style="list-style-type: none;"> <button type="button"  class="btn btn-quick .pmd-btn-fab cashButton" data-cashButton="${qReply[i].replies[j]}"> <div class="cash-reply-button-text" style="display:block !important;text-align:left">${qReply[i].replies[j]}</div><img src="avatar/image/${qReply[i].replies[j].replace(/ /g, '')}.svg" class="img-responsive.quick-reply-icon-cash>
        //                             "></button></ul>`
                        
        //                 }
        //             }
        //         else {
        //             apiquickRepliesHtml += `<div class="quick-replies-buttons">`
        //             for (let j = 0; j < qReply[i].replies.length; j++) {
        //                 apiquickRepliesHtml += `<div class="quickrepliesApi-buttons">`
        //                     apiquickRepliesHtml += `<button type="button"  class="btn btn-quick .pmd-btn-fab apiQuickreplybtnPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}">${qReply[i].replies[j]}</button>`
        //             }
        //         }
        //     }
        // }
        // apiquickRepliesHtml += `</div>`;
  
        // apiquickRepliesHtml += `</div></li>`;
        // return apiquickRepliesHtml;
    }
    var count =1;
    methods.fileUpload = (data) => {
        count++;
        console.log(count);
       
        let html = `<li class="animated fadeInLeft list-group-item background-color-custom">
        <table border="0" cellpadding="0" cellspacing="0">
        <tr>
        <td style="vertical-align:top;">
            <img width="35" height="35" class="bot-logo-image" style="border:none;" /></td>
            <td><li class="list-group-item background-color-custom">
      
        <div class="media-body bot-txt-space animated fadeInLeft">`
        
        html += `<p class="list-group-item-text-bot beforeAfter">${data.payload} <div style="float:right;" class="upload-btn-wrapper"><button class="btn-upload">UPLOAD PHOTO</button><input type="file" onchange="readImage(this)"></div><img id="output-image-upload${count}" style="float:right; margin-top:10px;" class="img-responsive output-image-upload" style="display: none;"/><span class="bot-res-timestamp abs receiver"> ${data.time}</span></p>`;
        
        html += `</div>
        </li></td>
        </tr>
    </table>


    </li>`;
        
        return html;
       
    }

   
    methods.multiplequickreplyfromapiai = (data) => {
        var apiquickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body animated fadeInLeft">`
        let qReply;
        if (data.payload) {
            qReply = data.payload;
        } else {
            qReply = data;
        }
        for (let i in qReply) {
            if (qReply[i].platform == "facebook" && qReply[i].type == "2") {
                
                    apiquickRepliesHtml += `<img style="border-radius:50%;border:2px solid white;float: left;margin-right: 10px;" width="40" height="40" src='${settings.botAvatar}'/>`
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<p class="list-group-item-quick-reply-space beforeAfter">${qReply[i].title}</p>`
                    }
                 else {
                 
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/><p class="list-group-item-quick-reply-space">${qReply[i].title}</p>`
                    }

                }
              
                for (let j = 0; j < qReply[i].replies.length; j++) {
                   var replies= qReply[i].replies.sort();
                    apiquickRepliesHtml += `<button type="button"  class="btn btn-quick .pmd-btn-fab multiplequickreplyfromapiai" data-multiplequickreplyfromapiai="${qReply[i].replies[j]}">${qReply[i].replies[j]}</button>`
            }
            apiquickRepliesHtml += `<div class="quickrepliesApireplayButton">`
            }
        }
        apiquickRepliesHtml += `</div>`;
  
        apiquickRepliesHtml += `</div></li>`;
        return apiquickRepliesHtml;
    }

    return methods;
});

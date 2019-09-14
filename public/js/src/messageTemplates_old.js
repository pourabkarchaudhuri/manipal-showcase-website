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

    methods.carousel = (data, uniqueId) => {
        var compiledTemplate = handlebars.getTemplate('carousel');
        data["uniqueId"] = uniqueId;
        let html = compiledTemplate(data);
        return html;
    }

    methods.quickrepliesfromapiai = (data) => {
        
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
                if (data.responseIndex) {
                    apiquickRepliesHtml += `<img style="border-radius:50%;border:2px solid white;float: left;margin-right: 10px;" width="40" height="40" src='${settings.botAvatar}'/>`
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<p class="list-group-item-quick-reply-space beforeAfter">${qReply[i].title}</p>`
                    }
                } else {
                   
                    if (qReply[i].title.trim().length) {
                        apiquickRepliesHtml += `<img style="border-radius:50%;float: left;margin-right: 10px;" width="40" height="40" src='avatar/blank.ico'/><p class="list-group-item-quick-reply-space">${qReply[i].title}</p>`
                    }

                }
               

                if (qReply[i].replies.indexOf("Buisness") != -1) {
                    apiquickRepliesHtml += `<div class="quick-replies-buttons" style="display: -webkit-inline-box;">`
                    for (let j = 0; j < qReply[i].replies.length; j++) {
                        qReply[i].replies.sort();
                            //apiquickRepliesHtml += `<button type="button"  class="btn btn-quick .pmd-btn-fab apiQuickreplybtnPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}"><img src="images/Query/${qReply[i].replies[j].replace(/ /g, '')}.svg" class="img-responsive quick-reply-icon"></button><div class="quick-reply-button-text" style="padding-left: 5px !important;">${qReply[i].replies[j]}</div></button>`
                            apiquickRepliesHtml += `<ul style="list-style-type: none;"><li><button type="button"  class="btn-quick .pmd-btn-fab apiquickRepliesPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}"><img src="avatar/image/${qReply[i].replies[j].replace(/ /g, '')}.svg" style="max-width:none !important;" class="img-responsive quick-reply-icon"></button></li><li><div class="quick-reply-button-text" style="padding-left: 5px !important;">${qReply[i].replies[j]}</div></li></ul>`
                            //<br><div class="quick-reply-button-text" style="display:block !important;text-align:left">${qReply[i].replies[j]}</div>
                    }
                } 
                    else if(qReply[i].replies.indexOf("Self Quotes") != -1) {
                        apiquickRepliesHtml += `<div class="quick-replies-Cash">`
                        for (let j = 0; j < qReply[i].replies.length; j++) {
                                apiquickRepliesHtml +=  `<ul style="list-style-type: none;"> <button type="button"  class="btn btn-quick .pmd-btn-fab cashButton" data-cashButton="${qReply[i].replies[j]}"> <div class="cash-reply-button-text" style="display:block !important;text-align:left">${qReply[i].replies[j]}</div><img src="avatar/image/${qReply[i].replies[j].replace(/ /g, '')}.svg" class="img-responsive.quick-reply-icon-cash>
                                    "></button></ul>`
                        
                        }
                    }
                else {
                    apiquickRepliesHtml += `<div class="quick-replies-buttons">`
                    for (let j = 0; j < qReply[i].replies.length; j++) {
                        apiquickRepliesHtml += `<div class="quickrepliesApi-buttons">`
                            apiquickRepliesHtml += `<button type="button"  class="btn btn-quick .pmd-btn-fab apiQuickreplybtnPayload" data-apiquickRepliesPayload="${qReply[i].replies[j]}">${qReply[i].replies[j]}</button>`
                    }
                }
            }
        }
        apiquickRepliesHtml += `</div>`;
  
        apiquickRepliesHtml += `</div></li>`;
        return apiquickRepliesHtml;
    }
    var count =1;
    methods.fileUpload = (data) => {
        count++;
        console.log(count);
       
        let html = `<li class="list-group-item background-color-custom">
      
        <div class="media-body bot-txt-space animated fadeInLeft">`
        
        html += `<p class="list-group-item-text-bot beforeAfter">${data.payload} <input type="file"  onchange="loadFile(event)"><img id="output" width="50px" height="50px" /><span class="bot-res-timestamp abs receiver"> ${data.time}</span></p>`;
        
        html += `</div>
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

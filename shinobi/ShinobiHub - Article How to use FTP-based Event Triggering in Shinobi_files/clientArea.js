$(document).ready(function(){
    $.confirm={e:$('#confirm_window')};
    $.confirm.title=$.confirm.e.find('.modal-title span')
    $.confirm.body=$.confirm.e.find('.modal-body')
    $.confirm.footer=$.confirm.e.find('.modal-footer')
    $.confirm.click=function(x,e){
        $.confirm.footer.find('.confirmaction').remove()
        var createButton = function(x,place,callback){
            $.confirm.footer.prepend('<button type="button" class="btn '+x.class+' confirmaction confirmaction'+place+'">'+x.title+'</button>')
            if(!x.class){x.class='btn-success'}
            if(!x.title){x.title='Save changes'}
            $.confirm.footer.find('.confirmaction'+place).click(function(){
                $.confirm.e.modal('hide')
                callback();
            })
        }
        if(x instanceof Array){
            $.each(x,function(place,x){
                createButton(x,place,x.callback)
            })
        }else{
            createButton(x,0,e)
        }
    }
    $.confirm.create = function(options){
        if(options.title && options.body){
            $.confirm.e.modal('show')
            $.confirm.title.text(options.title)
            $.confirm.body.css('word-wrap','initial')
            if(options.breakWord){
                $.confirm.body.css('word-wrap','break-word')
            }
            $.confirm.body.html(options.body)
        }
        if(options.clickOptions && options.clickCallback)$.confirm.click(options.clickOptions,options.clickCallback)
    }
    $.confirm.e.on('hidden.bs.modal', function () {
        $.confirm.footer.find('.confirmaction').remove()
    })
})

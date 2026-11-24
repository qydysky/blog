window.addEventListener("load", function(){
    var codeDom = document.getElementsByTagName("code");
    for (let index = 0; index < codeDom.length; index++) {
        const element = codeDom[index];
        element.addEventListener("mouseup", function(e){
            if(window.getSelection().type == "Caret"){
                var range = document.createRange();
                range.selectNodeContents(element);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
});
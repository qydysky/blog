window.addEventListener("load", function(){
    var codeDom = document.getElementsByTagName("code");
    for (let index = 0; index < codeDom.length; index++) {
        const element = codeDom[index];
        element.addEventListener("click", function(e){
            if(window.getSelection().type != "Range" || !window.getSelection().focusNode.isSameNode(element)){
                var range = document.createRange();
                range.selectNodeContents(element);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
});
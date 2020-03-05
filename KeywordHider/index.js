let keywordHider = {
  keyword     : '',
  hiliteColor : '',
  fontColor   : '',
  hiliteTag   : "MARK",
  endRegExp   : new RegExp('^[^\\w]+|[^\\w]+$', "g"),
  breakRegExp : new RegExp('[^\\w\'-]+', "g"),
  matchRegExp : "",
  hidewords   : 'false',

  createRegex : function(word){
    word = word.replace(this.endRegExp, "");
    word = word.replace(this.breakRegExp, "|");
    word = word.replace(/^\||\|$/g, "");
    if(word) {
      var re = "(" + word + ")";
      // if(!this.openLeft) { re = "\\b" + re;}
      // if(!this.openRight) {re = re + "\\b";}
      this.matchRegExp = new RegExp(re, "i");
      return this.matchRegExp;
    }
    return false;
  },
  blockImages : function(node){
    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++){
        this.blockImages(node.childNodes[i]);
      }       
    }                 
    if(node.nodeType == 1) {// NODE_TEXT			
      if(node.tagName=='IMG')
      {        
        if(node.getAttribute('alt')!=''){
          if(this.isWordFind(this.keyword,node.getAttribute('alt'))){                        
            // node.src = 'http://www.microworldsystems.com/download/tools/escan.png';
            // node.style.display = 'none';
            let pNone  = node.parentNode,            
                height = node.offsetHeight,            
                width  = node.offsetWidth;
                        
            let div = document.createElement('div');
            let style = 'position:relative;width:'+width+'px;height:'+height+'px';                 
                div.setAttribute('style',style);                
                pNone.appendChild(div); 
        
            let div2    = document.createElement('div'),
                style2  = 'position:absolute;width:'+width+'px;height:'+height+'display:none;color:#FFF;display:block;background:#ff0000;';                
                div2.setAttribute('style',style2);

                div.appendChild(node);          
                div.appendChild(div2); 
          } 
          else if(this.isWordFind(this.keyword,node.getAttribute('src'))){            
            // node.src = 'http://www.microworldsystems.com/download/tools/escan.png';
            // node.style.display = 'none';
          }          
        }                 
      }      
      /*let div = document.createElement('div');        
        let styleStr = 'position:fixed;top:0;left:0;right:0;'+
                       'bottom:0;background-color:rgba(0,0,0,0.5);z-index:2;cursor:pointer;';        
        div.setAttribute('style',styleStr);        
        div.appendChild(node);*/        
    }; 
  },
  blockVideos : function(){

  },
  blockYoutubeVideos : function(node){

  },
  dislayBlock : function(txtNode){
    if (this.isWordFind(this.keyword,txtNode.nodeValue)){      
    }
  },
  blockAdds : function(node){
    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++){
        this.blockAdds(node.childNodes[i]);
      }       
    }                 
    if(node.nodeType == 1) {// NODE_TEXT			      
      if(node.tagName=='A')
      {                
        //console.log('ele',node);             
        let cNode = node;
            node.remove();
        let pNode = document.createElement('div');
            pNode.appendChild(cNode);               
      }
    }   
  },
  isWordFind : function(word,htmltext){
    let keyword = word.toLowerCase(),
        htmldata= htmltext.toLowerCase().split(' ');

    return (htmldata.indexOf(keyword)>=0);
  },
  hiliteWords : function(txtNode){
    if(regs = this.matchRegExp.exec(txtNode.nodeValue)) {	    	                
      if(regs.index>0){
        let match = document.createElement(this.hiliteTag);
            match.appendChild(document.createTextNode(regs[0]));        
            match.style.backgroundColor = this.hiliteColor;            
            match.style.color           = this.hidewords==true? this.hiliteColor : this.fontColor; 

        let after       = txtNode.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        txtNode.parentNode.insertBefore(match, after);          
      }
    }
  },
  findTextNode : function(node){    
    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++){
        this.findTextNode(node.childNodes[i]);
      }       
    }                 
    if(node.nodeType == 3) {// NODE_TEXT			
        this.hiliteWords(node);        
    };       
  }
}

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  keywordHider.hiliteColor = '#ffff00';
  keywordHider.fontColor   = '#000000'; 
  keywordHider.hidewords   = false; 
  keywordHider.keyword     = 'java'; 
  keywordHider.createRegex(keywordHider.keyword);  
  //keywordHider.findTextNode(document.querySelector("html"));    
  keywordHider.blockImages(document.querySelector("html"));    
  // keywordHider.blockAdds(document.querySelector("html"));    
};
const targetNode  = document.querySelector('html'); // Select the node that will be observed for mutations
const config      = { attributes: true, childList: true, subtree: true };// Options for the observer (which mutations to observe)
const observer    = new MutationObserver(callback); // Create an observer instance linked to the callback function
observer.observe(targetNode, config);               // Start observing the target node for configured mutations
// observer.disconnect();// Later, you can stop observing

/*
  for specific url : "*://*.mozilla.org/*",
  use full links
    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension
    https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    https://www.the-art-of-web.com/javascript/search-highlight/#box1    
  
  Ad blobk :
    https://hackernoon.com/your-own-ad-blocker-in-3-minutes-bpo42wz


  function uses
  1] findTextNode : this function find all text node (recursively) present in current dom object
  2] hiliteWords  : this function find word using regex and if specific word found in text node then it will 
                    hilite words.
                    this function require textnode object of any element. 
  3] hideVideos   : for hiding videos
  4] dislayBlock  : it will display block page on whole html document                    
*/
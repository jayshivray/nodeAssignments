let keywordHider = {
  keyword     : '',
  hiliteColor : '',
  fontColor   : '',
  hiliteTag   : "MARK",
  endRegExp   : new RegExp('^[^\\w]+|[^\\w]+$', "g"),
  breakRegExp : new RegExp('[^\\w\'-]+', "g"),
  matchRegExp : "",
  hidewords   : 'false',
  styletag    : '',

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
      if(node.tagName=='IMG'){
        if (this.keyword=='*'){//block all images
          keywordHider.styletag.textContent = 'img {opacity: 0 !important;}* {background-image: none !important;}'; 
        }else{
          if(node.getAttribute('alt')!=''){
            if(this.isWordFind(this.keyword,node.getAttribute('alt'))){                                                
              node.classList.add('bImage');         
            } 
            else if(this.isWordFind(this.keyword,node.getAttribute('src'))){                        
              node.classList.add('bImage');                                  
            }          
          } 
        }                                 
      }             
    }; 
  },
  blockVideos : function(node){
    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++){
        console.log('ele',node.childNodes[i]);
        this.blockImages(node.childNodes[i]);
      }       
    }                 
    if(node.nodeType == 1) {// NODE_TEXT			
      if(node.tagName=='IMG')
      {        
        console.log('image');                
      }             
    };
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
  keywordHider.keyword     = '*'; 
  keywordHider.createRegex(keywordHider.keyword);  
  
  if (keywordHider.keyword=='*')
  {
    let styletag = document.createElement('style');  
    keywordHider.styletag = styletag;
    document.head.appendChild(keywordHider.styletag);
  } 
  //keywordHider.blockImages(document.querySelector('html'));  
  keywordHider.blockImages(document.querySelector('html'));  
  observer.disconnect();
};
const setMutationObserver = function()
{
  const targetNode  = document.querySelector('html'); // Select the node that will be observed for mutations  
  const config      = { attributes: true, childList: true, subtree: true };// Options for the observer (which mutations to observe)
        observer    = new MutationObserver(callback); // Create an observer instance linked to the callback function
  observer.observe(targetNode, config);               // Start observing the target node for configured mutations    
} 
var   observer;
setMutationObserver();

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
  https://github.com/tiborbarsi/image-video-block-browser-addon     

  get current element width and height
  let pNone  = node.parentNode,            
      height = node.offsetHeight,            
      width  = node.offsetWidth;
      console.log(`height ${height} width: ${width}`);  
*/
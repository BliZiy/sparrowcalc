/* SparrowCalc shared helpers. Runs locally; no network calls, no tracking. */
(function(){
  'use strict';
  var fmt = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
  window.SC = {
    money: function(n){ return isFinite(n) ? fmt.format(Math.round(n*100)/100) : '—'; },
    num: function(v){ var n = parseFloat(String(v).replace(/[$,\s]/g,'')); return isFinite(n) ? n : NaN; },
    esc: function(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); },
    el: function(tag, attrs, html){
      var e = document.createElement(tag);
      if(attrs){ for(var k in attrs){ if(k==='class') e.className=attrs[k]; else e.setAttribute(k,attrs[k]); } }
      if(html!=null) e.innerHTML = html;
      return e;
    }
  };
  document.addEventListener('DOMContentLoaded',function(){
    var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  });
})();

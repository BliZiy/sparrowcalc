/* SparrowCalc shared helpers. Runs locally; no network calls, no tracking. */
(function(){
  'use strict';
  var fmt = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
  window.SC = {
    money: function(n){ return isFinite(n) ? fmt.format(Math.round(n*100)/100) : '—'; },
    num: function(v){ var n = parseFloat(String(v).replace(/[$,\s]/g,'')); return isFinite(n) ? n : NaN; },
    esc: function(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); },
    MAX_MONEY: 1e9, // sane cap for any dollar input
    // Validate one input. opts: {label, min, max, required, int, blankValue}. Marks the field and
    // writes the message right after it. Returns {ok, v, msg}.
    check: function(input, opts){
      var raw = String(input.value).trim(), v, msg = '';
      if(raw === ''){
        if(opts.required) msg = opts.label + ': this field is required.';
        else v = opts.blankValue;
      } else {
        v = SC.num(raw);
        var lo = opts.min != null ? opts.min : -Infinity, hi = opts.max != null ? opts.max : Infinity;
        if(!isFinite(v)) msg = opts.label + ': enter a number.';
        else if(opts.int && Math.floor(v) !== v) msg = opts.label + ': enter a whole number.';
        else if(v < lo || v > hi) msg = opts.label + ': enter a number from ' + SC.fmtLimit(lo) + ' to ' + SC.fmtLimit(hi) + '.';
      }
      SC.mark(input, msg);
      return {ok: !msg, v: msg ? NaN : v, msg: msg};
    },
    fmtLimit: function(n){ return n >= 1e6 ? n.toLocaleString('en-US') : String(n); },
    // Show (or clear) an inline error next to a field
    mark: function(input, msg){
      var holder = input.parentNode, e = holder.querySelector('.field-err');
      if(msg){
        if(!e){ e = document.createElement('span'); e.className = 'field-err'; e.id = 'err-' + Math.random().toString(36).slice(2); holder.appendChild(e); }
        e.textContent = msg; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', e.id);
      } else {
        if(e) e.remove(); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
      }
    },
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

/* SparrowCalc payday holiday logic. Federal Reserve (ACH) holiday rules, computed locally:
   no API call, so it works offline and never breaks. Verified against Fed K.8 (2026-2030). */
(function(root){
  'use strict';
  var DAY = 86400000;
  function nth(y, m, wd, n){ // nth weekday (n=-1 for last) of month m (0-based), UTC ms
    if(n > 0){ var f = new Date(Date.UTC(y, m, 1)).getUTCDay(); return Date.UTC(y, m, 1 + ((wd - f + 7) % 7) + (n - 1) * 7); }
    var last = new Date(Date.UTC(y, m + 1, 0)); return Date.UTC(y, m, last.getUTCDate() - ((last.getUTCDay() - wd + 7) % 7));
  }
  // Returns [{date: ms (day banks are closed), name, actual: ms}] for year y.
  function fedHolidays(y){
    var out = [];
    function fixed(m, d, name){
      var t = Date.UTC(y, m, d), wd = new Date(t).getUTCDay();
      if(wd === 6) return; // Saturday: Fed banks stay open the Friday before
      out.push({date: wd === 0 ? t + DAY : t, name: name + (wd === 0 ? ' (observed)' : ''), actual: t});
    }
    function add(t, name){ out.push({date: t, name: name, actual: t}); }
    fixed(0, 1, "New Year's Day");
    add(nth(y, 0, 1, 3), 'Martin Luther King Jr. Day');
    add(nth(y, 1, 1, 3), "Washington's Birthday (Presidents Day)");
    add(nth(y, 4, 1, -1), 'Memorial Day');
    if(y >= 2022) fixed(5, 19, 'Juneteenth');
    fixed(6, 4, 'Independence Day');
    add(nth(y, 8, 1, 1), 'Labor Day');
    add(nth(y, 9, 1, 2), 'Columbus Day');
    fixed(10, 11, 'Veterans Day');
    add(nth(y, 10, 4, 4), 'Thanksgiving Day');
    fixed(11, 25, 'Christmas Day');
    return out.sort(function(a, b){ return a.date - b.date; });
  }
  function closedMap(y){ var m = {}; [y - 1, y, y + 1].forEach(function(yy){ fedHolidays(yy).forEach(function(h){ m[h.date] = h.name; }); }); return m; }
  function isBusiness(t, closed){ var wd = new Date(t).getUTCDay(); return wd !== 0 && wd !== 6 && !closed[t]; }
  function prevBiz(t, c){ do { t -= DAY; } while(!isBusiness(t, c)); return t; }
  function nextBiz(t, c){ do { t += DAY; } while(!isBusiness(t, c)); return t; }
  // schedule: {type:'semi', days:[1,15]} | {type:'biweekly', anchor: ms} | {type:'monthly', day: n}
  function paydays(s, y){
    var out = [], m, start = Date.UTC(y, 0, 1), end = Date.UTC(y, 11, 31);
    if(s.type === 'biweekly'){
      var off = Math.round((start - s.anchor) / DAY), shift = ((-off % 14) + 14) % 14;
      for(var t = start + shift * DAY; t <= end; t += 14 * DAY) out.push(t);
    } else {
      var days = s.type === 'semi' ? s.days : [s.day];
      for(m = 0; m < 12; m++) days.forEach(function(d){
        var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
        out.push(Date.UTC(y, m, d === 'last' ? last : Math.min(d, last)));
      });
      out.sort(function(a, b){ return a - b; });
    }
    return out;
  }
  function check(s, y){
    var c = closedMap(y);
    return paydays(s, y).map(function(t){
      var wd = new Date(t).getUTCDay(), reason = null;
      if(c[t]) reason = c[t]; else if(wd === 6) reason = 'Saturday'; else if(wd === 0) reason = 'Sunday';
      return {date: t, ok: !reason, reason: reason, early: reason ? prevBiz(t, c) : t, late: reason ? nextBiz(t, c) : t};
    });
  }
  var api = {fedHolidays: fedHolidays, paydays: paydays, check: check};
  if(typeof module !== 'undefined' && module.exports) module.exports = api; else root.SC_PH = api;
})(this);

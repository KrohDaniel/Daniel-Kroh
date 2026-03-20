/* ================================================
   TERMIN BOOKING — Calendar & Time Slot Picker
   ================================================ */

(function () {
  'use strict';

  // ---- CONFIG ----
  // Available days: 1 = Monday ... 5 = Friday
  const AVAILABLE_DAYS = [1, 2, 3, 4, 5];

  // Time slots (24h format)
  const TIME_SLOTS = [
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
  ];

  // How many weeks ahead can be booked
  const MAX_WEEKS_AHEAD = 6;

  // German month/day names
  const MONTHS = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  const WEEKDAYS_LONG = [
    'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
    'Donnerstag', 'Freitag', 'Samstag'
  ];

  // ---- STATE ----
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let selectedDate = null;
  let selectedTime = null;

  // ---- DOM ----
  const calGrid = document.getElementById('cal-grid');
  const calMonth = document.getElementById('cal-month');
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');
  const timeslotGrid = document.getElementById('timeslot-grid');
  const selectedDateLabel = document.getElementById('selected-date-label');
  const bookingSummary = document.getElementById('booking-summary');
  const formTermin = document.getElementById('form-termin');

  const panels = document.querySelectorAll('.termin-panel');
  const steps = document.querySelectorAll('.termin-step');

  // ---- HELPERS ----
  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function maxDate() {
    const d = today();
    d.setDate(d.getDate() + MAX_WEEKS_AHEAD * 7);
    return d;
  }

  function isAvailableDay(date) {
    const dow = date.getDay(); // 0=Sun
    const mapped = dow === 0 ? 7 : dow; // 1=Mon..7=Sun
    return AVAILABLE_DAYS.includes(mapped);
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function formatDateLong(date) {
    return WEEKDAYS_LONG[date.getDay()] + ', ' +
      date.getDate() + '. ' +
      MONTHS[date.getMonth()] + ' ' +
      date.getFullYear();
  }

  function formatDateShort(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return dd + '.' + mm + '.' + date.getFullYear();
  }

  // ---- STEP NAVIGATION ----
  function goToStep(step) {
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    steps.forEach(function (s) {
      var sNum = parseInt(s.dataset.step);
      s.classList.remove('is-active', 'is-done');
      if (sNum < step) s.classList.add('is-done');
      if (sNum === step) s.classList.add('is-active');
    });
    document.getElementById('step-' + step).classList.add('is-active');
    window.scrollTo({ top: document.querySelector('.termin-steps').offsetTop - 100, behavior: 'smooth' });
  }

  // ---- CALENDAR RENDER ----
  function renderCalendar() {
    calGrid.innerHTML = '';
    calMonth.textContent = MONTHS[currentMonth] + ' ' + currentYear;

    var firstDay = new Date(currentYear, currentMonth, 1);
    var startDay = firstDay.getDay(); // 0=Sun
    startDay = startDay === 0 ? 6 : startDay - 1; // shift to Mon=0

    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var t = today();
    var max = maxDate();

    // empty cells before 1st
    for (var i = 0; i < startDay; i++) {
      var empty = document.createElement('div');
      empty.className = 'cal-day is-empty';
      calGrid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(currentYear, currentMonth, d);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = d;

      if (date < t) {
        btn.classList.add('is-past');
      } else if (date > max) {
        btn.classList.add('is-past');
      } else if (!isAvailableDay(date)) {
        btn.classList.add('is-weekend');
      } else {
        btn.classList.add('is-available');
        btn.dataset.date = date.toISOString();
        btn.addEventListener('click', onDayClick);
      }

      if (isSameDay(date, t)) {
        btn.classList.add('is-today');
      }

      if (selectedDate && isSameDay(date, selectedDate)) {
        btn.classList.add('is-selected');
      }

      calGrid.appendChild(btn);
    }

    // Disable prev if at current month
    var now = new Date();
    calPrev.disabled = (currentYear === now.getFullYear() && currentMonth === now.getMonth());

    // Disable next if too far ahead
    var maxM = max.getMonth();
    var maxY = max.getFullYear();
    calNext.disabled = (currentYear > maxY || (currentYear === maxY && currentMonth >= maxM));
  }

  function onDayClick(e) {
    selectedDate = new Date(e.currentTarget.dataset.date);
    selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    goToStep(2);
  }

  calPrev.addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  calNext.addEventListener('click', function () {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  // ---- TIME SLOTS ----
  function renderTimeSlots() {
    timeslotGrid.innerHTML = '';
    selectedDateLabel.textContent = formatDateLong(selectedDate);

    var now = new Date();
    var isToday = isSameDay(selectedDate, today());

    TIME_SLOTS.forEach(function (time) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot';
      btn.textContent = time + ' Uhr';

      // If today, hide past times
      if (isToday) {
        var parts = time.split(':');
        var slotH = parseInt(parts[0]);
        var slotM = parseInt(parts[1]);
        if (slotH < now.getHours() || (slotH === now.getHours() && slotM <= now.getMinutes())) {
          btn.style.opacity = '0.3';
          btn.style.pointerEvents = 'none';
          timeslotGrid.appendChild(btn);
          return;
        }
      }

      btn.addEventListener('click', function () {
        selectedTime = time;
        timeslotGrid.querySelectorAll('.time-slot').forEach(function (s) {
          s.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');

        // Short delay then go to form
        setTimeout(function () {
          showForm();
        }, 300);
      });

      if (selectedTime === time) {
        btn.classList.add('is-selected');
      }

      timeslotGrid.appendChild(btn);
    });
  }

  function showForm() {
    var dateStr = formatDateLong(selectedDate);
    var summary = dateStr + ' um ' + selectedTime + ' Uhr';
    bookingSummary.textContent = summary;
    formTermin.value = formatDateShort(selectedDate) + ' um ' + selectedTime + ' Uhr';
    goToStep(3);
  }

  // ---- BACK BUTTONS ----
  document.getElementById('back-to-cal').addEventListener('click', function () {
    goToStep(1);
  });

  document.getElementById('back-to-time').addEventListener('click', function () {
    goToStep(2);
  });

  // ---- FORM SUBMIT / SUCCESS ----
  var form = document.getElementById('termin-form');
  var successEl = document.getElementById('form-success');

  // Check for success redirect
  if (window.location.search.includes('success=true')) {
    form.style.display = 'none';
    document.querySelector('.termin-form-header').style.display = 'none';
    successEl.classList.add('is-visible');
    // Hide step indicator
    document.querySelector('.termin-steps').style.display = 'none';
  }

  // ---- INIT ----
  renderCalendar();
})();

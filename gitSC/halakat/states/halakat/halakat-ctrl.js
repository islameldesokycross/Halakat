var halakatCtrl = ['$scope', '$state', function ($scope, $state) {

    $scope.vars = {};
    $scope.funs = {};


    $scope.vars.titleTxt = '';
    

    $scope.funs.opemMenu = function () {

        $state.transitionTo('home');
    }



    /*Calendar stff*/
    $scope.calendar = {};

    $scope.calendar.monthNames = ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الاول', 'جمادى الآخر',
		'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'];
    $scope.calendar.dayNames = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

    $scope.calendar.selectedYear = 1435;
    $scope.calendar.selectedMonth = 0;
    $scope.calendar.selectedDays = [];
    $scope.calendar.selectedMonthDays = 30;
    $scope.calendar.selectedMonthFirstDay = 0;

    $scope.calendar.currentDay = 1;
    $scope.calendar.currentMonth = 0;
    $scope.calendar.currentYear = 1435;




    $scope.calendar.currentDate = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar");

    $scope.calendar.currentYear = $scope.calendar.currentDate._year;
    $scope.calendar.currentMonth = $scope.calendar.currentDate._month - 1;
    $scope.calendar.currentDay = $scope.calendar.currentDate._day;


    $scope.calendar.selectedYear = $scope.calendar.currentYear;
    $scope.calendar.selectedMonth = $scope.calendar.currentMonth;


    $scope.calendar.constructedDays = [];

    $scope.calendar.construct = function (days, first) {
        var arr = [];
        var d = 0;
        for (var i = 0; i < 6; i++) {
            arr[i] = [];
            for (var j = 0; j < 7; j++) {
                if (first + j == 7) {
                    first = 0;
                    break;
                }
                arr[i][first + j] = ++d;
                if (d == days) return arr;
            }
        }
    }

    $scope.calendar.config = function () {
        var d = $.calendars.newDate($scope.calendar.selectedYear, $scope.calendar.selectedMonth + 1, 1, "Islamic", "ar");
        $scope.calendar.selectedMonthDays = d.daysInMonth();
        $scope.calendar.currentMonthFirstDay = (d.dayOfWeek() == 6) ? 0 : d.dayOfWeek() + 1;
        console.log($scope.calendar.selectedMonthDays, $scope.calendar.currentMonthFirstDay);
        $scope.calendar.constructedDays = $scope.calendar.construct($scope.calendar.selectedMonthDays, $scope.calendar.currentMonthFirstDay);
        console.log($scope.calendar.constructedDays);
    }

    $scope.calendar.nxtMonth = function () {
        if ($scope.calendar.selectedMonth == 11) {
            $scope.calendar.selectedMonth = 0;
            $scope.calendar.selectedYear++;
        }
        else $scope.calendar.selectedMonth++;
        $scope.calendar.config();
    }

    $scope.calendar.prevMonth = function () {
        if ($scope.calendar.selectedMonth == 0) {
            $scope.calendar.selectedMonth = 11;
            $scope.calendar.selectedYear--;
        }
        else $scope.calendar.selectedMonth--;
        $scope.calendar.config();
    }

    $scope.calendar.config();




    // Hijri picker
    $scope.picker = {};
    $scope.picker.currentDate = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar");
    $scope.picker.currentYear = $scope.picker.currentDate._year;
    $scope.picker.currentMonth = $scope.picker.currentDate._month - 1;
    $scope.picker.currentDay = $scope.picker.currentDate._day;
    $scope.picker.monthCount = 12;
    $scope.picker.remainingMonths = 12 - $scope.picker.currentMonth;
    $scope.picker.getRemainMonths = function (curM) {
        return 12 - curM;
    }
    $scope.picker.getDaysInMonth = function (y, m) {
        var xDate = $.calendars.newDate(y, m, 1, "Islamic", "ar");
        return xDate.daysInMonth();
    }
    $scope.picker.getRemainDaysInMonth = function (y, m , curD) {
        var DIM = $scope.picker.getDaysInMonth(y, m);
        return DIM - curD;
    }


}];
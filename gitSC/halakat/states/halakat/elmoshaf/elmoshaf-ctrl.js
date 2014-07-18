var elmoshafCtrl = ['$scope', '$state', function ($scope, $state) {

    window.scopea = $scope;
    $scope.$parent.vars.titleTxt = 'المصحف';
    
    $scope.vars = {
        quran: quran,//contains the quran suras with it is content
        quranData: QuranData, // contants data about the quran suras,pages,juzs,..............
        initialPage: 1,
        initialJuz: 1,
        initialSura: "الفاتحة",
        selectedAya: null,
        pagesuar: [],
        NumPageSuar: 0,
        pageLastAya: 0,
        pageNum:1
    };
    
    //get the content of a page
    $scope.getAyasOfPage = function (pageNum) {
        
        //if page number > 604 || < 1 end the process
        if (pageNum > 604 || pageNum < 1) {
            console.log("there is no page with this num");
            return;
        }
        
        //reset the data of the page
        $scope.resetpage();

        var nextpageData, prevpageData = null;
        var ayat = [];
        var i = 0;
        var lastPageSura = 0;
        
        //get current page data
        var currentpageData = $scope.vars.quranData.pages.page[pageNum-1];
        
        // if the pageNum is the first or the last page the prev and next page is null
        if (pageNum == 604) {
            nextpageData = null;
            prevpageData = $scope.vars.quranData.pages.page[pageNum-2];
            $scope.vars.NumPageSuar = 3;
            lastPageSura = parseInt(currentpageData.sura) + parseInt($scope.vars.NumPageSuar);
            
            for (i = currentpageData.sura; i < lastPageSura; i++) {
                $scope.vars.pagesuar.push({ header: $scope.getSuraData(i, "name"), ayas: $scope.getSuraContents(i) });
            }
        } else if (pageNum == 1) {
            prevpageData = null;
            nextpageData = $scope.vars.quranData.pages.page[pageNum];
            
            $scope.vars.NumPageSuar = 1;
            lastPageSura = parseInt(currentpageData.sura) + parseInt($scope.vars.NumPageSuar);
            
            for (i = currentpageData.sura; i < lastPageSura; i++) {
                $scope.vars.pagesuar.push({ header: $scope.getSuraData(i, "name"), ayas: $scope.getSuraContents(i) });
            }

        } else {
            prevpageData = $scope.vars.quranData.pages.page[pageNum-2];
            nextpageData = $scope.vars.quranData.pages.page[pageNum];
            $scope.vars.NumPageSuar = nextpageData.sura - currentpageData.sura;
            
            lastPageSura = parseInt(currentpageData.sura) + parseInt($scope.vars.NumPageSuar);

            if ($scope.vars.NumPageSuar == 0) {//it means the next page has the same sura as the cuurent so we will slice
                $scope.vars.pagesuar.push(
                    {
                        header: $scope.getSuraData(currentpageData.sura, "name"),
                        ayas: $scope.getSuraContents(currentpageData.sura, currentpageData.aya, nextpageData.aya - 1)
                    });
            } else {
                //if the current page is the last page of sura
                //means that the next page.sura-current page.sura = 1 && next page.aya = 1
                if (nextpageData.sura - currentpageData.sura == 1 ) {
                    if (nextpageData.aya == "1") { // done 
                        $scope.vars.pagesuar.push(
                            {
                                header: $scope.getSuraData(currentpageData.sura, "name"),
                                ayas: $scope.getSuraContents(currentpageData.sura, currentpageData.aya, $scope.getSuraData(currentpageData.sura, "ayas"))
                            });
                    } else {
                        for (i = currentpageData.sura; i < parseInt(currentpageData.sura) + 2; i++) {
                            if (i == currentpageData.sura) {
                                $scope.vars.pagesuar.push(
                                {
                                    header: $scope.getSuraData(i, "name"),
                                    ayas: $scope.getSuraContents(i, currentpageData.aya, $scope.getSuraData(currentpageData.sura, "ayas"))
                                });
                            } else {
                                $scope.vars.pagesuar.push(
                                {
                                    header: $scope.getSuraData(i, "name"),
                                    ayas: $scope.getSuraContents(i, 1, nextpageData.aya - 1)
                                });
                            }
                        }
                    }
                } else {
                    if (nextpageData.aya == "1") {
                        for (i = currentpageData.sura; i < nextpageData.sura; i++) {
                            if (i == currentpageData.sura) {
                                if (currentpageData.aya == 1) {
                                    $scope.vars.pagesuar.push(
                                        {
                                            header: $scope.getSuraData(i, "name"),
                                            ayas: $scope.getSuraContents(i)
                                        });
                                } else {
                                    $scope.vars.pagesuar.push(
                                       {
                                           header: $scope.getSuraData(i, "name"),
                                           ayas: $scope.getSuraContents(i, currentpageData.aya, $scope.getSuraData(currentpageData.sura, "ayas"))
                                       });
                                }
                            } else {
                                $scope.vars.pagesuar.push(
                                        {
                                            header: $scope.getSuraData(i, "name"),
                                            ayas: $scope.getSuraContents(i)
                                        });
                            }
                        }
                    } else {
                        for (i = currentpageData.sura; i < parseInt(nextpageData.sura) + 1 ; i++) {
                            if (i == currentpageData.sura) {
                                if (currentpageData.aya == 1) {
                                    $scope.vars.pagesuar.push(
                                    {
                                        header: $scope.getSuraData(i, "name"),
                                        ayas: $scope.getSuraContents(i)
                                    });
                                } else {
                                    $scope.vars.pagesuar.push(
                                       {
                                           header: $scope.getSuraData(i, "name"),
                                           ayas: $scope.getSuraContents(i, currentpageData.aya, $scope.getSuraData(currentpageData.sura, "ayas"))
                                       });
                                }
                            } else if (i == nextpageData.sura) {
                                $scope.vars.pagesuar.push(
                                    {
                                        header: $scope.getSuraData(i, "name"),
                                        ayas: $scope.getSuraContents(i, 1, nextpageData.aya - 1)
                                    });
                            } else {
                                $scope.vars.pagesuar.push(
                                    {
                                        header: $scope.getSuraData(i, "name"),
                                        ayas: $scope.getSuraContents(i)
                                    });
                            }
                        }
                    }
                }
            }
        }

        
        
        //$scope.vars.pageayas = [];
        
        var firstAyas = $scope.vars.quran.sura[currentpageData.sura].aya;
    };

    //get the sura content of ayas 
    $scope.getSuraContents = function(suraNum, start, end) {
        var _start = start-1 || 0;
        var _end = end || $scope.vars.quran.sura[suraNum - 1].aya.length;
        var text = $scope.vars.quran.sura[suraNum - 1].aya.slice(_start, _end);
        //console.log(text);
        return text;
    };

    //get the data about any sura
    $scope.getSuraData = function(suraNumber, property) {
        return $scope.vars.quranData.suras.sura[suraNumber - 1][property];
    };

    //reset the page data
    $scope.resetpage = function() {
        $scope.vars.pagesuar = [];
        $scope.vars.NumPageSuar = 0;
        $scope.vars.pageLastAy = 0;
           
    };
    
    //select an aya
    $scope.selectAya = function(aya) {
        $scope.vars.selectedAya = aya;
    };

    $scope.nextPage = function () {
        if ($scope.vars.pageNum == 604) {
            console.log("there is no page with this number");
            return;
        }
        $scope.vars.pageNum++;
        $scope.getAyasOfPage($scope.vars.pageNum);
    };

    $scope.prevPage = function () {
        if ($scope.vars.pageNum == 1) {
            console.log("there is no page with this number");
            return;
        }
        $scope.vars.pageNum--;
        $scope.getAyasOfPage($scope.vars.pageNum);
    };
    
    $scope.getAyasOfPage($scope.vars.pageNum);
}];
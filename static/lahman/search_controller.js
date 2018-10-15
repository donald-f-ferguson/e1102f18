
BaseballApp.controller("SearchController", [ '$scope', '$http', function($scope, $http) {

    console.log("SearchController loaded.");

    $scope.pageMode = {
        currentMode:        0,
        showOptions:        1,
        showResult:         2
    };
    $scope.pageMode.currentMode = $scope.pageMode.showOptions;

    $scope.selectedSearchMode = false;

    $scope.searchStates = {
        byId: "0",
        byName: "1",
        byQuery: "2",
        byTeamAndYear: "3"
    };
    $scope.currentSearchState = null;

    var urlBase = "http://127.0.0.1:5000/api/";

    $scope.inputFirstName = null;
    $scope.inputLastName = null;
    $scope.inputTeamID = null;
    $scope.inputYearID = null;
    $scope.inputPlayerId = null;
    $scope.inputMode = null;
    $scope.atHome = true;
    $scope.searchFields = null;
    $scope.queryEnabled = true;
    $scope.havePaging = false;

    $scope.search_type = null;
    $scope.currentPeople = null;
    $scope.currentPage = null;
    $scope.battingInfo = null;
    $scope.showDetails = false;
    $scope.changedQueryFields = false;


    var urlBase = "http://127.0.0.1:5000/api/";

    $scope.searchFields = null;

    $scope.haveData = false;
    $scope.havePrev = false;
    $scope.haveNext = false;

    $scope.showingQueryData = false;

    var debug_on = true;
    var debug_message = function(msg, obj) {
        if (debug_on) {
            console.log(msg + JSON.stringify(obj, null, 4));
        }
    };

    $scope.buttonStates = {
        lookUp: {code: 0, msg: "Look it up dude!"},
        resetIt: {code: 1, msg: "Reset it dude."},
        queryIt: {code: 2, msg: "Query it dude!"},
        byTeamAndYear: {code: 3, msg: "Get by team and year"}
    };
    $scope.currentButtonState = $scope.buttonStates.lookUp;



    $scope.$watch('search_type', function (value) {

        switch(value) {
            case $scope.searchStates.byId:
                $scope.selectedSearchMode = true;
                $scope.currentSearchState = value;
                break;
            case $scope.searchStates.byName:
                $scope.selectedSearchMode = true;
                $scope.currentSearchState = value;
                break;
            case $scope.searchStates.byQuery:
                $scope.selectedSearchMode = true;
                $scope.currentSearchState = value;
                displayQueryFields();
                break;
            case $scope.searchStates.byTeamAndYear:
                $scope.selectedSearchMode = true;
                $scope.currentSearchState = value;
                break;
            default:
                console.log("Invalid search type designated.");
                $scope.currentSearchState = null;
                break;
        }
    });

    var invoke_get_api = function(resource, params) {
        var url = urlBase + resource;
        config = {params: params};
        return $http.get(url, config);
    };

    var displayQueryFields = function() {
        var resource = "people/metadata";
        invoke_get_api(resource).then(
            function(result) {
                debug_message("Metadata for people is ", result);
                $scope.searchFields = result.data;
            },
            function(error) {
                debug_message("Metadata for people returned error ", error);
            }
        );
    };

    $scope.canLookup = function() {
        temp = $scope.currentSearchState;
        var result = false;

        switch(temp) {

            case $scope.searchStates.byId:
                if ($scope.inputPlayerId && $scope.inputPlayerId.length > 0) {
                    result = true;
                }
                break;
            case $scope.searchStates.byName:
                if ($scope.inputLastName && $scope.inputLastName.length > 0) {
                    result = true;
                }
                break;
            case $scope.searchStates.byQuery:
                for (i in $scope.searchFields) {
                    f = $scope.searchFields[i];
                    if (f['value']) {
                        if (f['value'].length > 0) {
                            result = true;
                            break;
                        }
                    }
                }
                break;
            case $scope.searchStates.byTeamAndYear:
                $scope.selectedSearchMode = true;
                if ($scope.inputTeamID && $scope.inputTeamID.length > 0 &&
                        $scope.inputYearID && $scope.inputYearID.length > 0) {
                    result = true;
                }
                break;
            default:
                console.log("Invalid search type designated.");
                $scope.currentSearchState = null;
                break;
        }

        return result;
    };

    $scope.doSearchButton = function() {

        if ($scope.currentButtonState == $scope.buttonStates.resetIt) {
            $scope.havePrev = false;
            $scope.haveNext = false;
            $scope.currentPeople = null;
            $scope.haveData = false;
            $scope.havePaging = false;
            $scope.currentButtonState = $scope.buttonStates.lookUp;
            $scope.inputPlayerId = null;
            $scope.inputLastName = null;
            $scope.inputLastName = null;
            //$scope.searchFields = null;
            $scope.showingQueryData = false;
            $scope.teamID = null;
            $scope.yearID = null;
            $scope.showingQueryData = false;
            return;
        }

        temp = $scope.currentSearchState;

        switch(temp) {

            case $scope.searchStates.byId:
                doGetByPlayerId();
                break;
            case $scope.searchStates.byName:
                doGetByName();
                break;
            case $scope.searchStates.byQuery:
                doGetByQuery()
                break;
            case $scope.searchStates.byTeamAndYear:
                $scope.selectedSearchMode = true;
                doGetByTeamAndYear();
                break;
            default:
                console.log("Invalid search type designated.");
                $scope.currentSearchState = null;
                break;
        }

    };

    var doGetByQuery = function() {
        resource = "people";
        params = {};

        for (var i = 0; i < $scope.searchFields.length; i++) {
            var f = $scope.searchFields[i];
            n = f['Field'];
            params[n] = f['value'];
        }

        invoke_get_api(resource, params).then(
            function(data) {
                if (data && data.data) {
                    debug_message("Player is = ", data);
                    $scope.currentButtonState = $scope.buttonStates.resetIt;
                    $scope.showingQueryData = true;
                    doPeoplePage(data.data);
                } else {
                    debug_message("Nothing found.");
                }
            },
            function(error) {
                debug_message("Error = ", error)
            }
        );
    };

    var doGetByPlayerId = function() {
        resource = "people/" + $scope.inputPlayerId;
        invoke_get_api(resource, null).then(
            function(data) {
                if (data && data.data) {
                    debug_message("Player is = ", data);
                    $scope.haveData = true;
                    $scope.currentPeople = [];
                    $scope.currentPeople.push(data.data.data);
                    $scope.currentButtonState = $scope.buttonStates.resetIt;
                    console.log("Current people = ", JSON.stringify($scope.currentPeople))
                } else {
                    debug_message("Nothing found.");
                }
            },
            function(error) {
                debug_message("Error = ", error)
            }
        );
    };

    $scope.getPlayerID = function(idx) {
        if (($scope.currentPeople) && ($scope.currentPeople[idx])) {
            var cp = $scope.currentPeople[idx]
            if (cp.playerID.value) {
                return cp.playerID.value;
            }
            else {
                return cp.playerID
            }
        }
    }
    var doPeoplePage = function(data) {
        $scope.haveData = true;
        $scope.currentPeople = data.data;

        if (data.links && data.links.length > 0) {
            $scope.havePaging = true;
            $scope.haveNext = false;
            $scope.havePrev = false;

            for (var i = 0; i < data.links.length; i++) {
                c = data.links[i];
                if (c.next) {
                    $scope.haveNext = c.next;
                }
                if (c.previous) {
                    $scope.havePrev = c.previous;
                }
            }
        }
    };

    $scope.doPaging = function(direction) {
        if (direction == 'next') {
            url = $scope.haveNext
        }
        else {
            url = $scope.havePrev;
        }

        $http.get(url).then(
            function(data) {
                doPeoplePage(data.data);
            },
            function(error) {
                debug_message("Error = ", error);
            }
        );

    };

    var doGetByName= function() {
        var resource = "people"
        var params = {}
        params.nameLast = $scope.inputLastName;
        if ($scope.inputFirstName && $scope.inputFirstName.length > 0) {
            params.nameFirst = $scope.inputFirstName;
        }

        invoke_get_api(resource, params).then(
            function(data) {
                if (data && data.data) {
                    debug_message("Player is = ", data);
                    $scope.currentButtonState = $scope.buttonStates.resetIt;
                    doPeoplePage(data.data);
                } else {
                    debug_message("Nothing found.");
                }
            },
            function(error) {
                debug_message("Error = ", error)
            }
        );
    };

    var doGetByTeamAndYear = function() {
        var resource = "rosters"
        var params = {}
        params.yearID = $scope.inputYearID;
        params.teamID = $scope.inputTeamID;

        invoke_get_api(resource, params).then(
            function(data) {
                if (data && data.data) {
                    debug_message("Player is = ", data);
                    $scope.currentButtonState = $scope.buttonStates.resetIt;
                    doPeoplePage(data.data);
                } else {
                    debug_message("Nothing found.");
                }
            },
            function(error) {
                debug_message("Error = ", error)
            }
        );
    };

    $scope.canShowPeople = function() {
        result = $scope.haveData && $scope.currentPeople && ($scope.showDetails == false);
        return result;
    };

    var getDate = function(year, month, day) {
        var result;
        if (year) {
            result = year;
            if (month) {
                result += "-" + month;
                if (day) {
                    result += "-" + month;
                }
                else {
                    result += "UNKNOWN"
                }
            }
            else {
                result += "UNKNOWN-UNKNOW"
            }
        }
        else {
            result = "UNKNOWN"
        }

        return result;
    };

    $scope.details = function(idx) {
        var resource1 = "people/" + $scope.currentPeople[idx].playerID.value;
        var resource2 = "batting?playerID=" + $scope.currentPeople[idx].playerID.value
        promise1 = invoke_get_api(resource1, null);
        promise2 = invoke_get_api(resource2, null)
        Promise.all([promise1, promise2]).then(
            function(result) {
                $scope.showDetails = true;
                $scope.playerDetails = {}
                $scope.playerDetails.player_info = result[0].data.data;

                $scope.playerDetails.player_info.fullName =
                    $scope.playerDetails.player_info.nameFirst + " " +
                    $scope.playerDetails.player_info.nameLast;
                $scope.playerDetails.player_info.DOB = getDate(
                    $scope.playerDetails.player_info.birthYear,
                    $scope.playerDetails.player_info.birthMonth, $scope.playerDetails.player_info.birthDay);
                $scope.playerDetails.player_info.DOD = getDate(
                    $scope.playerDetails.player_info.deathYear,
                    $scope.playerDetails.player_info.deathMonth, $scope.playerDetails.player_info.deathDay);

                $scope.playerDetails.batting_info = result[1].data.data;
                $scope.$apply();

            }
        );
        $scope.showDetails = true;
        $scope.playerDetails = {};
        $scope.playerDetails.player_info = $scope.currentPeople[idx];
        $scope.playerDetails.player_info.fullName = $scope.currentPeople[idx].nameFirst + " " +
            $scope.currentPeople[idx].nameLast;
        debug_message("battingInfo = ", $scope.battingInfo);
    };

    $scope.doCloseDetails = function() {
        $scope.showDetails = false;
    };


}]);


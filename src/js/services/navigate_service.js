
app.factory("NavigateService", function($location) {
	return function($xscope) {
		$xscope.$emit("navigate", $location.path() );
	};
});
//if(jQuery) console.log("jQuery is loaded.");

var app_data = {
	date: null
}

$(document).ready(function() {
	$("#datechange_id").change(function() {

		var date_dom = $("#datechange_id").val(); //grabs data from DOM
		$("#datechange_id").css("width", String(date_dom.length/1.77 + "em")) //adjust date input box based on length of date string

		if (date_dom != app_data.date) { //triggers first time when dom is ran, everytime the date is changed this value changes as well
			
			app_data.date = date_dom; //it will set app_data.date to current date automatically and keep track if it changes or not
			//date header
			$('#dateheader').html("".concat("<h2> Activity from ", moment(date_dom.split(' - ')[0]).format('MMMM Do YYYY'), " - ", 
				moment(date_dom.split(' - ')[1]).format('MMMM Do YYYY'), "</h2>")) 

			$.ajax({ //for time series graph
				type: "POST",
				url: '/graph', //sends json variable views.py function with @app.route('/graph')
				data: { date_backend: date_dom }, //only sending date information to backend
				success: function(results) { 
					console.log(results) //from returned value in views.py
					var chart = c3.generate({ //generate javascript graph c3.js
						bindto: "#timeseries_plot", //html tag in DOM
						data: {
							columns: [
								['date'].concat(results.created_on),
								['count'].concat(results.sum),
								['count2'].concat(results.sum)
							],
							x: 'date',
							type: 'bar',
							types: { count2: 'spline' }
						},
						legend: { position: 'right' },
						axis: { 
							x: { 
								type: 'timeseries',
								tick: { format: '%b %d, %Y' } 
							}
						} //,zoom: { enabled: true }
					})
				},
				error: function(error) {
					console.log(error)
				}
			}); 
		}
	});
});



//$('input[name = "daterange"]').change(function() {

//how ajax works:
//	get data from DOM, var x = $('html_id').val()
//	put into .ajax({ 
//				type: "POST", 
//				url: 'flask view url', 
//				data: {value: x},
//				success: function(results) {}
//				error: function(error) {console.log(error)}
//			  })




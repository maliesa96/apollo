    var ctx = document.getElementById('pollchart').getContext('2d');
    var pollchart
    var polldata
    var bin_width
    var bin_count
    var labels = []
    var numberedavg
    var votes
    var remove
    var present = {}

    Chart.defaults.global.defaultFontFamily = 'gtwalsh';
    Chart.defaults.global.defaultFontSize = 15;

    var colors = ['#1FC8A4','#4B5E62','#EF946C','#3993DD','#EC5766','#AA5042','#CFD11A','#F78764', '#FDCA40', '#882E81' ]



    function drawChart(initial_data){

        polldata = []
        bin_width = 0
        bin_count = 0
        labels = []


        var i

        $(".marker").each(function(index) {
            $(this).css('backgroundColor',colors[index])
        });

        if (type === 'mc' || type === 'yn'){

            for  (i=0; i<initial_data.length; i++)
            {
                labels.push(initial_data[i][0])
                polldata.push(initial_data[i][1])
            }

            drawMC(labels, polldata)
        }

        else if (type === 'n'){
            drawNumbered(start, end, initial_data)
        }
    }


    function drawMC(labels,polldata) {

        pollchart = new Chart(ctx, {

            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: labels,
                datasets: [{
                    label: "Count",
                    backgroundColor: colors,
                    borderColor: colors,
                    data: polldata,

                }]

            },

            // Configuration options go here

            options: {responsive: true,

                maintainAspectRatio: false,

                scales: {
                    xAxes: [
                    {
                        gridLines: {
                            //drawOnChartArea: false,
                            offsetGridLines: false,
                            display: false,
                            //drawticks: false,
                            color: "black",
                        },
                        ticks: {
                          //fontColor: "#fff",
                          min: 0,
                          stepSize: 1,
                          display: true,
                        },
                        maxBarThickness: 50,
                    }],

                    yAxes: [{
                        gridLines: {
                            display: false,
                            color: "black"
                        },
                        ticks: {
                         // fontColor: "#fff",
                          min: 0,
                          callback: function(value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            },
                        },
                    }],


                },
                legend: {
                    labels: {
                        //fontColor: "#fff",
                        fontSize: 12
                    },
                    display: false,
                },
                layout: {
                    padding: {
                        top: 20,
                    }
                },

                plugins: {
                    labels: {
                        render: function(args){if(args.value != 0){return args.value} else {return ''}},

                    }
                },

            }

            });
    }

    function drawNumbered(start, end, datadict) {

        numberedavg = datadict['avg']
        votes = datadict['votes']

        var range = end-start

        labels = [start]

        if ( 5 < range && range <= 10){
            bin_width = 1
            bin_count = range
        }
        else {
            bin_width = (end-start)/10
            bin_count = 10
        }

        var bin_data = Array.apply(null, Array(bin_count)).map(Number.prototype.valueOf,0)  // array of zeros


        for (i=0; i < bin_count; i++)
        {
            // labels = [0, 1, 2, 3...9]

            labels.push(twoDecimals(labels[i]+bin_width))

        }

        for (var v=0; v < votes.length; v++)
        {
            if (votes[v] === labels[0]){
                bin_data[0] += 1
            }
            else {
                for (i=1; i < labels.length; i++) {
                    if (votes[v] > labels[i] && votes[v] <= labels[i+1])
                    {
                        bin_data[i] += 1
                        break
                    }
                }
            }

        }

        polldata = bin_data

        pollchart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: "Votes",
                    backgroundColor: colors[0],
                    borderColor: colors[0],
                    data: polldata,
                },
]

            },
            options: {responsive: true,

                maintainAspectRatio: false,

                scales: {
                    xAxes: [
                    {
                        display: false,
                        ticks: {
                            max: labels[labels.length-2]
                            },
                        barPercentage: 1.1,

                    },
                    {
                        gridLines: {
                            offsetGridLines: false,
                            display: false,
                            color: "black",
                        },
                        ticks: {
                          max: labels[labels.length-1]+bin_width,
                          display: true,
                        },
                        maxBarThickness: 50,

                    }],

                    yAxes: [{
                        gridLines: {
                            display: false,
                            color: "black"
                        },
                        ticks: {
                         // fontColor: "#fff",
                          min: 0,
                          callback: function(value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            },
                        },
                    }],


                },
                legend: {
                    labels: {
                        //fontColor: "#fff",
                        fontSize: 12
                    },
                    display: false,
                },
                layout: {
                    padding: {
                        top: 20,
                    }
                },
                plugins:{
                    labels:{
                        render: function(){ return ''},
                    }
                }


            }

        });
    }


    function update(chart, vote) {

        currentdata = chart.data.datasets[0].data

         //update counter

         totalvotes += 1
        $("#votecount").text(totalvotes)

        if (type === 'n'){

            if (vote === labels[0])
            {
                currentdata[0] += 1
            }

            else {
                for (i=1; i < labels.length; i++)
                {
                    if (vote > labels[i] && vote <= labels[i+1])
                    {
                        currentdata[i] += 1
                        polldata = currentdata
                        break
                    }
                }
            }
            chart.update();

            votes.push(vote)

            //update average

            numberedavg = votes.reduce(sum,0)/(totalvotes)
            $(".nseries p").text("Average: "+ twoDecimals(numberedavg))

        }


        else if (type === 'mc' || type === 'yn'){

            var series = $(".series").find("span:contains('"+vote+"')")[0]
            var index = $(series).attr('data-name').split('-')[1]

            currentdata[parseInt(index)]+=1
            chart.update();     // update chart


            var seriescount = $("[data-name='count-"+index+"']")
            count = parseInt($(seriescount).text().split(' ')[0])
            seriescount.text(count+1+" votes")      // update series counter

            $(".percent").each(function(i)
            {
                var other_count = parseInt($(this).siblings("[data-name='count-"+i+"']").text().split(' ')[0])
                $(this).text("("+((other_count)/(totalvotes)*100).toFixed(1)+"%)")  // update percent for each series

            });

        }



    }

    $(".fa-chart-pie").click(function(){

        if ($(this).hasClass("click-disabled")) {   // do nothing if disabled
            return
        }

        $(this).addClass("active")
        $(".fa-chart-bar").removeClass("active")
        pollchart.destroy()

        pollchart = new Chart(ctx, {

        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: "Count",
                backgroundColor: colors,
                data: polldata,

            }]

        },

        // Configuration options go here

        options: {responsive: true,

            maintainAspectRatio: false,

            legend: {
                labels: {
                    //fontColor: "#fff",
                    fontSize: 12
                },
                display: false,
            },
            plugins: {
                labels: {
                    render: 'percentage',
                    precision: 1,
                    fontColor: '#fff',
                    showZero: false,
                }

            },

        }

        });

        })

    $(".fa-chart-bar").click(function(){

            $(this).addClass("active")
            $(".fa-chart-pie").removeClass("active")
            pollchart.destroy()

            if (type === 'mc' || type === 'yn'){

                pollchart = new Chart(ctx, {

                    // The type of chart we want to create
                    type: 'bar',

                    // The data for our dataset
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "Count",
                            backgroundColor: colors,
                            borderColor: colors,
                            data: polldata,

                        }]

                    },
                    options: {responsive: true,

                        maintainAspectRatio: false,

                        scales: {
                            xAxes: [
                            {
                                gridLines: {
                                    //drawOnChartArea: false,
                                    offsetGridLines: false,
                                    display: false,
                                    //drawticks: false,
                                    color: "black",
                                },
                                ticks: {
                                  //fontColor: "#fff",
                                  min: 0,
                                  stepSize: 1,
                                  display: true,
                                },
                                maxBarThickness: 50,
                            }],

                            yAxes: [{
                                gridLines: {
                                    display: false,
                                    color: "black"
                                },
                                ticks: {
                                 // fontColor: "#fff",
                                  min: 0,
                                  callback: function(value, index, values) {
                                        if (Math.floor(value) === value) {
                                            return value;
                                        }
                                    },
                                },
                            }],


                        },
                        legend: {
                            labels: {
                                //fontColor: "#fff",
                                fontSize: 12
                            },
                            display: false,
                        },
                        layout: {
                            padding: {
                                top: 20,
                            }
                        },

                        plugins: {
                            labels: {
                                render: function (args) {
                                if (args.value!= 0){
                                    return args.value;
                                }
                                else
                                 {
                                    return '';
                                 }
                                },
                            }
                        },

                    }
                });
            }

            else if (type === 'n'){

                pollchart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "Votes",
                            backgroundColor: colors[0],
                            borderColor: colors[0],
                            data: polldata,
                        },
                        ]

                    },
                    options: {responsive: true,

                        maintainAspectRatio: false,

                        scales: {
                            xAxes: [
                            {
                                display: false,
                                ticks: {
                                    max: labels[labels.length-2]
                                    },
                                barPercentage: 1.1,

                            },
                            {
                                gridLines: {
                                    offsetGridLines: false,
                                    display: false,
                                    color: "black",
                                },
                                ticks: {
                                  max: labels[labels.length-1]+bin_width,
                                  display: true,
                                },
                                maxBarThickness: 50,

                            }],

                            yAxes: [{
                                gridLines: {
                                    display: false,
                                    color: "black"
                                },
                                ticks: {
                                 // fontColor: "#fff",
                                  min: 0,
                                  callback: function(value, index, values) {
                                        if (Math.floor(value) === value) {
                                            return value;
                                        }
                                    },
                                },
                            }],


                        },
                        legend: {
                            labels: {
                                //fontColor: "#fff",
                                fontSize: 12
                            },
                            display: false,
                        },
                        layout: {
                            padding: {
                                top: 20,
                            }
                        },
                        plugins:{
                            labels:{
                                render: function(){ return ''},
                            }
                        }


                    }

            });
        }

            // Configuration options go here



    });


    $("#closepoll").click(function(){

        $("input").val('')
        $(".selected").removeClass("selected")
        $(".poll-type-form").addClass("hidden")

        var message = {
            'close': roomid,
        }
        socket.send(JSON.stringify(message));


    })

    $("#startpoll").click(function(){

        var options = []

        if (type === "mc"){
            $("#"+type+"form").find("input").each(function(e){
                options.push($(this).val())
                $(".fa-chart-pie").removeClass("click-disabled")

            })
        }

        else if (type === 'yn'){
                $(".fa-chart-pie").removeClass("click-disabled")
        }

        else if (type === 'n'){
            $("#"+type+"form").find("input").each(function(e){
                options.push(parseFloat($(this).val()))
                $(".fa-chart-pie").addClass("click-disabled")
            })
        }

        var title = capitalize($("#id_title").val())

        if (title != ''){

            var message = {
                'open': roomid,
                'title': title,
                'type': type,
                'options': options,
            }

            data = loadnewpoll(title, type, options)
            drawChart(data)

            socket.send(JSON.stringify(message));
        }
    })



   socket.onmessage = function(e) {

        var data = JSON.parse(e.data);

        if (data.hasOwnProperty('vote')){    // data['vote'] will eval to false if vote = 0
            var vote = data['vote'];
            update(pollchart, vote)
        }
        else if (data['joined']){
            var name = data['joined']
            var id = data['id']
            present[id] = true

            if ($("#"+id).length === 0) {   // if element doesnt already exist
                var newparticipant = participant.replace('NAME', name).replace('ID', id)
                $(newparticipant).appendTo("#left-column").hide().fadeIn(500)
            }

        }
        else if (data['left']){
            var name = data['left']
            var id = data['id']
            var p = $("#"+id)
            present[id] = false

            setTimeout(function (){
                if(present[id] === false){
                    p.fadeOut(500, function() {     //evaluates to false if user rejoins before animation is complete
                        p.remove()
                    })
                }
            }, 5000)
        }

        else if (data['close']){
            $(".inner").css('transform', 'rotateY(180deg)')
        }
        else if (data['newpoll-conf']){
            $(".inner").css('transform', 'rotateY(0deg)')
        }

    };

    function loadnewpoll(title, type, options){

        if (typeof pollchart != 'undefined'){ //if a poll exists we destroy the chart
            pollchart.destroy()
        }

        $("#pollstats").empty()
        $(".chart-title").text(title)
        $("#votecount").text(0)
        totalvotes = 0 //reset count

        var data = []

        if (type === 'mc'){
            for (i=0; i < options.length; i++){

                var newseries = series.replace('hidden','').replace('LABEL',options[i]).replace('COUNT',0).replace('PERCENT',0)
                .replace(/\INDEX/g,i)
                $("#pollstats").append(newseries)

                data.push([options[i],0,0])             //result: [[option 1, 100, 33%], [option 2, 200, 66%]...]

            }

        }

        else if (type === 'yn'){
            var yn = ['Yes', 'No']

            for (i=0; i < yn.length; i++){

                var newseries = series.replace('hidden','').replace('LABEL',yn[i]).replace('COUNT',0).replace('PERCENT',0)
                .replace(/\INDEX/g,i)
                $("#pollstats").append(newseries)

                data.push([yn[i],0,0])

            }

        }

        else if (type === 'n'){

            // set new start and end vars

            start = options[0]
            end = options[1]

            data = {'avg': 0,
                    'votes': [],
                            }
            var newseries = nseries.replace('hidden','').replace('AVG',0)
            $("#pollstats").append(newseries)


        }

        return data   //must come last

    }

    function sum(a, b) {
        return a + b;
    }

    function twoDecimals(num){
        return Math.round(num*100)/100
    }

    function capitalize(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



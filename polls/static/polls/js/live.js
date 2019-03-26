

        pusher.connection.bind( 'error', function( err ) {
          if( err.error.data.code === 4004 ) {
            log('>>> detected limit error');
          }
        });


        var qidmap = []; //keeps track of which dataset corresponds to what question
        var rooms = ["1"]   //array of room numbers
        var i;
        var channelzero = pusher.subscribe('presence-zero'); //create/delete poll events go here
        var channels = []

        for (i=0; i < rooms.length; i++)
        {
             channels[i] = pusher.subscribe('presence-'+rooms[i])
        }

        //colorset must be global
        const colorset = ['rgba(42, 68, 148, 1)', 'rgba(255, 155, 113, 0.7)', '#17BEBB', '#D9DD92', 'rgb(255,239,128)', 'rgb(255,226,26)', 'rgb(242,242,242)' ,'rgb(191,191,191)', 'rgb(140,140,140)']


        /* channelzero.bind('pusher:subscription_succeeded', function() { */




       /* }); */



        var data = []
        var bins = [4.75, 4.5, 4.25, 4, 3.75, 3.5, 3.25, 3]

        for (i=0; i < voteset.length; i++) //create list of lists for chart data
        {

            var j;
            var bin_data = [0, 0, 0, 0, 0, 0, 0, 0, 0]


            for (j=0; j < voteset[i].length; j++){

                if  (voteset[i][j]< bins[bins.length-1]) {
                        bin_data[bins.length] += 1;
                    }

                else {

                    var w;
                    for (w=0; w < bins.length; w++) {

                        if (voteset[i][j] >= bins[w]){
                            bin_data[w] += 1;
                            break;
                        }
                    }
                }

            }

            data.push(bin_data)

        }


        var ctx = document.getElementById('pollchart').getContext('2d');

        var pollchart = new Chart(ctx, {

            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: ["4.75+", "4.5+", "4.25+", "4+", "3.75+", "3.5+", "3.25+", "3+","< 3"],
                datasets: createDatasets(data)

            },

        // Configuration options go here

        options: {responsive: true,

            maintainAspectRatio: false,

            scales: {
                xAxes: [
                {
                    gridLines: {
                        drawOnChartArea: false,

                        drawticks: true,
                        color: "black",
                    },
                    ticks: {
                      //fontColor: "#fff",
                      min: 0,
                      stepSize: 1,
                      display: true,
                    },
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
                }
            },
        }

        });


        for (i=0; i < pollchart.data.datasets.length; i++){

            addStatsCard(qidmap[i],polltitles[i],polldescs[i],pollchart)
        }






        function addData(chart, newdata, label) {

            if(typeof label != "undefined") {
               chart.data.labels.push(label);
            }
        }

        function createDatasets(polldata) {
            var i;
            var list_of_datasets = []

            for (i=0; i < polltitles.length; i++)
            {
                var dataset = {}

                dataset.label =  polltitles[i];
                dataset.backgroundColor = colorset[i]
                dataset.borderColor = colorset[i]
                dataset.data = polldata[i]

                list_of_datasets.push(dataset)

                qid = pollids[i]

                qidmap.push(qid)


            }
            return list_of_datasets;
        }

        function updateChart(chart, data) {
            var vote = data.vote;
            var name = data.name;
            var qid = data.id
            var index = qidmap.indexOf(qid)

            currentdata = chart.data.datasets[index].data

            if  (vote < bins[bins.length-1]) {
                    currentdata[bins.length] += 1;
                }

            else {

                for (i=0; i < bins.length; i++) {

                    if (vote >= bins[i]){
                        currentdata[i] += 1;
                        break
                    }
                }
            }

            chart.update();

        }

        for (i=0; i < channels.length; i++) {
            channels[i].bind('vote', function(data){                     //bind to channel events
                updateChart(pollchart, data);
                //console.log('got the vote')
            });

            channels[i].bind('pusher:member_added',function(member){
                console.log('member added: ', member.info.name)
            });

            channels[i].bind('pusher:member_removed',function(member){
                 console.log('member left: ', member.info.name)
            });
        }

        channelzero.bind('closepoll', function(data){
            console.log('callback bound: close poll ', data.title)
            closePoll(pollchart,data) // delete dataset from chart
        });

        channelzero.bind('newpoll', function(data){
            newPoll(pollchart,data)
        });

        function closePoll(chart,data){
            qid = data.id

            index = qidmap.indexOf(qid)

            chart.data.datasets.splice(index,1) //delete dataset from chart
            chart.update()

            qidmap.splice(index, 1) //delete id from qidmap

            removeStatsCard(qid)
        }

        function newPoll(chart, newpolldata){

            title = newpolldata.polltitle
            desc = newpolldata.polldesc
            qid = newpolldata.id

            var num_of_polls = chart.data.datasets.length

            qidmap.push(qid) //add poll to qidmap

            var newcolor = unusedColors(chart)[0] //first unused color we can find

            newdataset = {
                label: title,
                backgroundColor: newcolor,
                borderColor: newcolor,
                data: Array.apply(null, Array(bins.length)).map(Number.prototype.valueOf,0) //array of zeros

            }

            chart.data.datasets.push(newdataset)
            chart.update()          //add new dataset to chart and update

            addStatsCard(qid, title, desc, chart)

        }

        function addStatsCard(qid, polltitle, polldesc, chart){
            var card = document.createElement("div");
            card.className = "card shadow border-0"
            card.id = "card-" + qid

            var row = document.createElement("div")
            row.className = "row"
            row.setAttribute("style", "margin: 0;")

            var cardside = document.createElement("div")
            cardside.className = "col-2 rounded-left"
            cardside.setAttribute("style","background-color:" + chart.data.datasets[qidmap.indexOf(qid)].backgroundColor +";") //match card background color to dataset

            var rightside = document.createElement("div")
            rightside.className = "col-9 p-2"


            var title = document.createElement("div");
            title.className = "card-title"
            title.id = "card-" + qid + "-title"
            var node = document.createTextNode(polltitle);
            title.appendChild(node)

            var desc = document.createElement("div");
            desc.className = "card-"+qid+"-text"
            node = document.createTextNode(polldesc)
            desc.appendChild(node)

            card.appendChild(cardside)

            rightside.appendChild(title)
            rightside.appendChild(desc)


            row.appendChild(cardside)
            row.appendChild(rightside)
            card.appendChild(row)

            var cardgroup = document.getElementById("poll-stats");
            cardgroup.insertBefore(card, cardgroup.firstChild)

            $('#card-'+card.id).hide().fadeIn(500); //animate

        }

        function removeStatsCard(qid){

        $('#card-'+qid).fadeOut(500)
        
        }

        function unusedColors(chart){

            var datasets = chart.data.datasets
            var unused_colors = colorset.slice(0) // iteratively remove used colors from this array
            var used_color

            for (i=0; i < datasets.length; i++)
            {
                used_color = datasets[i].backgroundColor
                unused_colors.splice(unused_colors.indexOf(used_color),1) //remove used color from our list of colors

            }

            return unused_colors
        }




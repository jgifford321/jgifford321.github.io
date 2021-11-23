$(document).ready(function () {


    $('#ParameterInput').on('submit', function (e) {
        e.preventDefault();
        var tmax = parseInt($('#tmax').val());
     
      
      //initial levels   
        var alpha0 = parseFloat($('#alpha0').val()); //share of income to  capital
        var s0 = parseFloat($('#s0').val()); //savings rate
        var delta0 = parseFloat($('#delta0').val()); //depreciation rate
        var g0 = parseFloat($('#g0').val()); // growth rate of TFP, or z*l
        var n0 = parseFloat($('#n0').val()); // population growth rate
        var l0 = parseFloat($('#l0').val()); //fraction of pop in R&D
        var z0 = parseFloat($('#z0').val()); //fproductivity parameter
        var K0 = parseFloat($('#K0').val()); //initial capital
        var A0 = parseFloat($('#A0').val()); //initial TFP
        var L0 = parseFloat($('#L0').val()); //initial labor
        //var kstar0 = Math.pow((1-l0)*(s0/(z0*l0+n0+delta0)),1/(1-alpha0));
       

       
        //shock
       
        var alpha1 = parseFloat($('#alpha1').val()); //share of income to  capital
        var s1 = parseFloat($('#s1').val()); //savings rate
        var delta1 = parseFloat($('#delta1').val()); //depreciation rate
        var g1 = parseFloat($('#g1').val()); // growth rate of TFP, or z*l
        var n1 = parseFloat($('#n1').val()); // population growth rate
        var l1 = parseFloat($('#l1').val()); //fraction of pop in R&D
        var z1 = parseFloat($('#z1').val()); //fproductivity parameter
        var K1 = parseFloat($('#K1').val()); //shock capital
        //var A1 = parseFloat($('#A1').val()); //shockTFP
        var L1 = parseFloat($('#L1').val()); //shock labor
        //var kstar1 = Math.pow((1-l1)*(s1/(z1*l1+n1+delta1)),1/(1-alpha1));


        var interval = 0;
        var enableMarks = true;
        var showCounterFactual = document.getElementById ("counterFactual");

        var input = document.getElementById ("steady");
            
        if (tmax<=30) {
            interval = 5;
        }
        else if (30<tmax&&tmax<=100) {
            interval = 20;
            enableMarks = false;
        }
        else if (100<tmax&&tmax<=500) {
            interval = 100;
            enableMarks = false;
        }
        else {
            interval = 500;
            enableMarks = false;
        };

        
        var L = [L0]
        var A = [A0]
        var K = [K0]
        var Y = []
        var C = []

        var KLag = [K0];
        var LLag = [L0];
        var ALag = [A0];  
        var YLag = [];


       
        var LSeries = [L0];
        var ASeries = [A0];
        var KSeries = [K0];
        var YSeries = [];
        var CSeries = [];
      


        for (i = 0; i <= tmax; i++){
            if (i<20) {
                
                LLag = LSeries[LSeries.length-1];
                L = LLag*(1+n0);
                LSeries.push(L);

                ALag = ASeries[ASeries.length-1];
                A = ALag*(1+z0*l0);
                ASeries.push(A);
               
               
                YLag = YSeries[YSeries.length-1];
                Y = KLag**alpha0*(ALag*(1-l0)*(LLag))**(1-alpha0);
                YSeries.push(Y);
                

                KLag= KSeries[KSeries.length-1];
                K = KLag+(s0*Y-delta0*KLag);
                KSeries.push(K);

                C = Y*(1-s0);
                CSeries.push(C);
                





            }
             else if ((i==20) && (K1 != 1)||(L1!=1)) {
                KLag= KSeries[KSeries.length-1];
                K = (KLag+(s0*Y-delta0*KLag))*K1;
                KSeries.push(K);

                LLag = LSeries[LSeries.length-1];
                L = (LLag*(1+n0))*L1;
                LSeries.push(L);

                YLag = YSeries[YSeries.length-1];
                Y = KLag**alpha0*(ALag*(1-l0)*(LLag*L1))**(1-alpha0);
                YSeries.push(Y);      
 
                ALag = ASeries[ASeries.length-1];
                A = ALag*(1+z0*l0);
                ASeries.push(A);

                C = Y*(1-s0);
                CSeries.push(C);
                


             }
             else if (i>20) {   
                
                
                LLag = LSeries[LSeries.length-1];
                L = LLag*(1+n1);
                LSeries.push(L);

                ALag = ASeries[ASeries.length-1];
                A = ALag*(1+z1*l1);
                ASeries.push(A);
               
               
                YLag = YSeries[YSeries.length-1];
                Y = KLag**alpha1*(ALag*(1-l1)*(LLag))**(1-alpha1);
                YSeries.push(Y);
                

                KLag= KSeries[KSeries.length-1];
                K = KLag+(s1*Y-delta1*KLag);
                KSeries.push(K);

                C = Y*(1-s0);
                CSeries.push(C);
                
                
                
                
                
                
                
                
                
                
                
                // kLag = kSeries[kSeries.length-1];
                // k = kLag + (s1*(kLag**alpha1)*((1-l1)**(1-alpha1))-(z1*l1+delta1+n1)*kLag);
                // kSeries.push(k);
               
                // y = (kLag**alpha1)*((1-l1)**(1-alpha1));
                // ySeries.push(y);
            }

        }
  
        sessionStorage.setItem('KSeries',JSON.stringify(KSeries));
        sessionStorage.setItem('YSeries',JSON.stringify(YSeries));
        sessionStorage.setItem('cSeries',JSON.stringify(CSeries));
        //sessionStorage.setItem('iSeries',JSON.stringify(ISeries));
        sessionStorage.setItem('periods',tmax);
  

        $('#capital_per_worker').highcharts({
            chart: {
                type: 'line',
                height: 500,
                width: 800,
                marginRight: 10,
                marginBottom: 10,
                
            },

            credits: {
                enabled: false
            },

            plotOptions: {
                series: {
                    lineWidth: 2,
                    marker : {
                        enabled : false,
                        radius : 3},
                    animation: {
                        duration: 10000     //Controls the time required for plot to be fully rendered.
                    }
                }
            },

            title: {
                text: 'An Economy Towards the Steady State',
                style: {
                    "fontSize": "15px" 
                }
            },
            xAxis: {
                // type: 'datetime',
                // tickPixelInterval: 150,
                tickInterval: interval,
                text: 'Time'
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function() 
                    {
                        return Math.round(this.value*100)/100;
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: '#808080'
                }]
            },

            legend: {
                enabled: true
            },
            exporting: {
                enabled: true,
                buttons: {
                    contextButton: {
                        menuItems: ['downloadPNG']
                    },
                },
            },
            series: [{
                name: 'K',
                data: (function () {
                    var data = [];

                    for (i = 0; i <= tmax; i++) {

                        data.push({
                            x: i,
                            y: Math.round(100000*KSeries[i])/100000,
                        })
                    }
                    return data;
                })()
            },
            {
                 name: 'Y',
                 color: '#f15c80',
                 data: (function () {
                     var data = [];

                     for (i = 0; i <= tmax; i++) {
                            
                        data.push({
                            x: i,
                            y: Math.round(100000*YSeries[i])/100000,
                        })
                         
                     }
                     return data;   
                 })()
            },
            {
                name: 'C',
                    color: '#808080',
                data: (function () {
                    var data = [];

                    for (i = 0; i <= tmax; i++) {
                           
                       data.push({
                           x: i,
                           y: Math.round(100000*CSeries[i])/100000,
                       })
                        
                    }
                    return data;   
                })()
           }
            ]
        });
    }) //.trigger('submit');
});

function reloadFunction() {
    sessionStorage.clear();
    location.reload();
}

function downloadFunction() {
    
    if (sessionStorage.getItem('eSeries') == null){
        window.alert('Run the simulation first.')
    } else {
        var e = JSON.parse(sessionStorage.getItem('eSeries'));
        var k = JSON.parse(sessionStorage.getItem('kSeries'));
        var y = JSON.parse(sessionStorage.getItem('ySeries'));
        var c = JSON.parse(sessionStorage.getItem('cSeries'));
        var inv = JSON.parse(sessionStorage.getItem('iSeries'));
        var K = JSON.parse(sessionStorage.getItem('KSeries'));
        var Y = JSON.parse(sessionStorage.getItem('YSeries'));
        var C = JSON.parse(sessionStorage.getItem('CSeries'));
        var I = JSON.parse(sessionStorage.getItem('ISeries'));
        var periods = parseInt(sessionStorage.getItem('periods'));

        var row1 = [];
        row1.push("Period");
        row1.push("Capital per effective worker (K/EL)");
        row1.push("Output per effective worker (Y/EL)");
        row1.push("Consumption per effective worker (C/EL)");
        row1.push("Investment per effective worker (I/EL)");
        row1.push("");
        row1.push("Capital per worker (K/L)");
        row1.push("Output per worker (Y/L)");
        row1.push("Consumption per worker (C/L)");
        row1.push("Investment per worker (I/L)");
        row1.push("");
        row1.push("Labor efficiency (E)");

        var rows = [row1]
        for (i = 0; i <= periods; i++) {
            rows.push([i,k[i],y[i],c[i],inv[i],"",K[i],Y[i],C[i],I[i],"",e[i]]);
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray){
           let row = rowArray.join(",");
           csvContent += row + "\r\n"; // add carriage return
        }); 

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "solow_data.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "solow_data.csv".
    }

}
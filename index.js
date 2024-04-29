
// call make nodes when the full html page is loaded
const indianCities = [

    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Surat",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan-Dombivli",
    "Vasai-Virar",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Chandigarh",
    "Guwahati",
    "Solapur",
    "Hubli-Dharwad",
    "Tiruchirappalli",
    "Bareilly",
    "Moradabad",
    "Mysore",
    "Tiruppur",
    "Gurgaon",
    "Aligarh",
    "Jalandhar",
    "Bhubaneswar",
    "Salem",
    "Warangal"
  ];
  
  console.log(indianCities);
  




document.addEventListener('DOMContentLoaded', function(){
    let value = document.getElementById('slider').value;
    
    document.getElementsByClassName('current_node_count')[0].innerHTML = value;

    make_nodes(value);

});



// slider for change the nodes amount

var slider = document.getElementById('slider');
slider.addEventListener('input', function() {
        var value = parseInt(this.value);
        document.getElementsByClassName('current_node_count')[0].innerHTML = value;
        console.log(value);
        make_nodes(value);
});




//  make nodes ----------------------------------------------------------------
function make_nodes(amount){
    if (cy) {
        cy.edges().remove();
        cy.nodes().remove();
    }
    
    var cy  = cytoscape({
        
        container: document.getElementById('cy'),

        elements: function(){
            var nodes = [];
            var edges = [];
            
            // Create nodes
            for (var i = 1; i <= amount; i++) {
                nodes.push({ data: { id: 'node' + i  ,citit_name : indianCities[i-1] } });
            }

            // Create edges connecting each node to every other node
            
            for (var i = 1; i <= amount; i++) {
                for (var j = i + 1; j <= amount; j++) {
                    // console.log(nodes[i].data );         
                    edges.push({ data: { id: 'edge' + i + '_' + j, source: 'node' + i, target: 'node' + j, from_citi : indianCities[i-1] ,to_citi : indianCities[j-1] , weight: '0' } });
                }
            }

            return nodes.concat(edges);
        }(),

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)',
                    'width': 10,
                    'height': 10
                }
            }
            ,{
                selector: 'edge',
                style: {
                    'label':'data(weight)' ,
                    'color': 'red',
                    'curve-style': 'bezier',
                    'line-color': '#ccc',
                    'width': 2
                }
            }
            
        ],

        layout: {

            name: 'random'
            
        }
        
        
    });

    window.cy = cy;

    make_mst();


    cy.ready(function(){
        // Add event listener for node position changes
        cy.nodes().on('position', function(event) {
            
            make_mst();

        });
    }); 
    



}
// end of function make node ----------------------------------------------------------------




//  make mst after making node ----------------------------------------------------------------
function make_mst(){

    cy.ready(function(){
        // Iterate over the edges
        cy.edges().forEach(function(edge){
            // Access the data object of each edge and log the weight
            let id_1 = edge.id().split('_')[0].replace('edge','');
            let id_2 = edge.id().split('_')[1];

            //  edge1_12

            let n_1 = cy.$('#node' + id_1).position()
            let n_2 = cy.$('#node' + id_2).position();

            // console.log(n_1, n_2);

            // find distance between two nodes 
            let distance_temp = Math.sqrt( (n_1.x-n_2.x)**2 + (n_1['y']-n_2['y'])**2);

            // distance_temp =  String([distance_temp, 'dist'].join(''))


            console.log(distance_temp+'dist')
            // set weight using distance formula  
            edge.data('weight',parseInt(distance_temp));
            

            // console.log('Weight of edge ' + edge.id() + ':', edge.data('weight'));
        });
    });


    
    cy.edges().style({
        'width':'0',
        'line-color': 'blue'
    });   
                    

    //  find mst edges 
    var mstEdges = primMST(cy);
    
    // console.log('edges' ,mstEdges);

    //  find their ids 
    var mstEdgeIds = mstEdges.map(edge => '#' + edge.id());

    // console.log(mstEdges);

    cy.edges(mstEdgeIds.join()).style({
        'width':'2',
        'line-color': 'blue'
    });            
    // console.log( 'mstEdgeIds---' ,mstEdgeIds);


    // console.log('cities---'  );
    // mstEdges.forEach(element => {
    //         console.log('from : ', element.data('from_citi'), ' to : ' ,element.data('to_citi') );
    // });



    // set_degree(mstEdgeIds)



  
        

}
// end of function make mst after making node ----------------------------------------------------------------



//set_degree function start ----------------------------------------------------------------



function set_degree(mstEdgeIds){


    // It is used to import collect.js library 
   
    
    // this line 😎

    temp_nodes = [...mstEdgeIds.map(e => (e.replace('#edge','')).replace('_',' '))].join(' ').split(' ');



    console.log(temp_nodes)

    // this line for count number
    // console.log( '-- ',temp_nodes.filter(n => n=='1').length);

    let degree_count_list = 
        cy.nodes().map(function(node){
            return node.data('degree');
        });
    

    // console.log(cy.nodes()[1].data('degree'));


    for (i = 0; i <degree_count_list.length ; i++) {
        cy.nodes()[i].data(  'degree' ,temp_nodes.filter(n => n==((i+1))).length)
    }

    // cy.nodes().forEach(node => {console.log(node.id() ,node.data('degree'))})   


    odd_degree_nodes = []  

    cy.nodes().forEach(node => {
        if  (node.data('degree')%2!=0){
            odd_degree_nodes.push(node)
        }
    })      

    
    // console.log(cy.elements())
    // new_cy = cy.filter(cy_temp => node.data('degree

    // odd_degree_nodes.forEach(node =>{console.log(node.id())});
    
    
    odd_degree_nodes.sort((node1, node2) => {
        // Get the positions of the nodes
        var pos1 = node1.position();
        var pos2 = node2.position();
    
        // Compare the x-coordinates
        if (pos1.x < pos2.x) return -1;
        if (pos1.x > pos2.x) return 1;
    
        // If x-coordinates are equal, compare y-coordinates
        if (pos1.y < pos2.y) return -1;
        if (pos1.y > pos2.y) return 1;
    
        return 0 
    });
    
    // Now, odd_degree_nodes array is sorted by their position
    // console.log('after sorting')




    
    // odd_degree_nodes.forEach(node => {console.log( node.id());});
    

    new_connection = make_min(odd_degree_nodes,mstEdgeIds);

    // console.log('--adsa' , new_connection);
    // console.log('--adsa' , second_time_include);

    cy.edges(new_connection.join()).style('width',2);

    console.log( '--', mstEdgeIds)

    mstEdgeIds = mstEdgeIds.concat(new_connection)

    console.log(  '--' ,mstEdgeIds)
  


    
    
    
    
    
    
    path_list = []
    

    console.log('cities---'  );
    mstEdgeIds.forEach(element => {

            let from = cy.$(element).data('from_citi') 
            let to = cy.$(element).data('to_citi')
            if (from!=undefined || to!=undefined)
            {
                // console.log('from : ', from, ' to : ' ,to );
                path_list.push(from + ' to ' +to)
            }else {
                element = element.replace('#edge','').split('_')
                element = '#edge'+element[1] + '_' + element[0]
                let from = cy.$(element).data('from_citi') 
                let to = cy.$(element).data('to_citi')
                // console.log('from : ', to, ' to : ' ,from );
                path_list.push(to + ' to ' + from)
            }
    });


    console.log(path_list);

    

    







    




    // let new_mstEdgeIds = [mstEdgeIds[0]] ;







    


    // console.log(new_mstEdgeIds);
    
    
    

    
    
    // cy.edges(new_edge_id.join()).forEach((element)=>{element.style('width',2)});

    

}



function make_min(odd_degree_nodes,mstEdgeIds){

    console.log(mstEdgeIds);

    new_connection = [];
    // second_time_include = [];

    visited = [];
    n = odd_degree_nodes.length;

    while (visited.length < n){


        let first_node = odd_degree_nodes.shift();
        let second_node = odd_degree_nodes.shift();

        console.log( first_node.id(),'--' , first_node.data('degree'))
        
        first_node.data('degree', 1 + first_node.data('degree'))
        second_node.data('degree', 1 + second_node.data('degree'))

        console.log( first_node.id(),'--' , first_node.data('degree'))
        

        
        // console.log( '--', first_node.id().replace('node',''));
        // console.log( '--', second_node.id().replace('node',''));

        let temp_edge 
        if  ( parseInt(first_node.id().replace('node','')) < parseInt(second_node.id().replace('node','')))
            {temp_edge = '#edge'+ first_node.id().replace('node','') + '_' + second_node.id().replace('node','');
            // console.log(temp_edge)
        }else{ 
            temp_edge = '#edge'+ second_node.id().replace('node','') + '_' + first_node.id().replace('node','');
            // console.log(temp_edge); 
}
        if (mstEdgeIds.includes(temp_edge)){
            // console.log( 'alredy include');
            visited.push(first_node);
            visited.push(second_node);

            console.log(temp_edge)
            temp_edge = '#edge'+ 
                temp_edge.replace('#edge','').split('_')[1] 
                + '_' + 
                temp_edge.replace('#edge','').split('_')[0] ;

            
            
            new_connection.push(temp_edge);
            

        } 
        else {
            // console.log( 'not include');
            new_connection.push(temp_edge);
            visited.push(first_node);
            visited.push(second_node);

            
        }

        // console.log(visited)
        // console.log(odd_degree_nodes)
    
        // break
        
        
    }

    return new_connection;
    
}



function calculateEdgeWeight(node1, node2) {

    n_1 = node1.position();
    n_2 = node2.position();
    let distance_temp = Math.sqrt( (n_1.x-n_2.x)**2 + (n_1['y']-n_2['y'])**2);

    return distance_temp;
}








// set degree function end ----------------------------------------------------------------






// Prim's algorithm to find Minimum Spanning Tree  --------------------------------

function primMST(cy) {
    var mstEdges = [];
    var visited = new Set();

    
    var startNode = cy.nodes().first();
    visited.add(startNode.id());

    while (visited.size < cy.nodes().size()) {
        
        var minEdge = null;
        var minWeight = Infinity;

        cy.edges().forEach(function(edge) {
            // console.log(edge.source().id())
            if (!visited.has(edge.source().id()) && visited.has(edge.target().id())) {
                var weight = edge.data('weight');
                if (weight < minWeight) {
                    minWeight = weight;
                    minEdge = edge;
                }
            } else if (!visited.has(edge.target().id()) && visited.has(edge.source().id())) {
                var weight = edge.data('weight');
                if (weight < minWeight) {
                    minWeight = weight;
                    minEdge = edge;

                }
            }
        });

        if (minEdge) {
            mstEdges.push(minEdge);
            if (!visited.has(minEdge.source().id())) {
                visited.add(minEdge.source().id());
            } else if (!visited.has(minEdge.target().id())) {
                visited.add(minEdge.target().id());
            }
        }
    }

    return mstEdges;
}






// end of function Prim's algorithm --------------------------------


















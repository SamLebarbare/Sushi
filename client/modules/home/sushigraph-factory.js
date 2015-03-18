'use strict';
var cytoscape = require('cytoscape/dist/cytoscape.min.js');
/**
 * Home module for displaying home page content.
 */

angular
    .module('sushi.home')
    .factory('sushiGraph', [ '$q', function( $q ) {
      var cy;

      var sushiGraph = function(sushis) {
        var deferred = $q.defer();

        // put sushis model in cy.js
        var eles = [];
        for( var i = 0; i < sushis.length; i++ ){
          var sushi = sushis[i];
          var info;


          if (sushi.dataCache.state) {
            info = sushi.title + ' (' + sushi.dataCache.state + ')';
          }  else {
            info = sushi.title;
          }

          eles.push({
            group: 'nodes',
            data: {
              id: sushi.id,
              type: sushi.typeInfo,
              weight: sushi.qi,
              size: 100,
              picture: 'url(/images/'+ sushi.type + '.svg)',
              name: info,
              faveColor: '#b3e5fc',
              faveShape: 'roundrectangle'
            }
          });
        }

        for( var i = 0; i < sushis.length; i++ ){
          if(sushis[i].subSushis) {
            for( var s = 0; s < sushis[i].subSushis.length; s++ ) {
              eles.push({
                group: 'edges',
                data: {
                  source: sushis[i].id,
                  target: sushis[i].subSushis[s].id,
                  faveColor: '#30426a',
                  strength: 0.1
                }
              });
            }
          }

        }

        $(function(){ // on dom ready

          cy = cytoscape({
            container: $('#cy')[0],

            style: cytoscape.stylesheet()
              .selector('node')
                .css({
                  'shape': 'data(faveShape)',
                  'width': 'data(size)',
                  'height': 100,
                  'content': 'data(name)',
                  'text-valign': 'top',
                  'text-outline-width': 2,
                  'background-image': 'data(picture)',
                  'background-fit': 'cover',
                  'color': '#ffffff',
                  'box-shadow': '0 10px 18px rgba(0,0,0,.22),0 14px 45px rgba(0,0,0,.25)'
                })
              .selector(':selected')
                .css({
                  'border-width': 3,
                  'border-color': '#333'
                })
              .selector('edge')
                .css({
                  'opacity': 0.666,
                  'width': 'mapData(strength, 35, 50, 2, 6)',
                  'target-arrow-shape': 'triangle',
                  'source-arrow-shape': 'circle',
                  'line-color': 'data(faveColor)',
                  'source-arrow-color': 'data(faveColor)',
                  'target-arrow-color': 'data(faveColor)'
                })
              .selector('.faded')
                .css({
                  'opacity': 0.25,
                  'text-opacity': 0
                }),

            layout: {
              name: 'breadthfirst',
              directed: true,
              padding: 5
            },

            elements: eles,

            ready: function() {
              deferred.resolve( this );

              cy.on('cxtdrag', 'node', function(e){
                var node = this;
              });

              cy.on('tap', 'node', function(e){
                var node = this;
                fire('onClick', [ node.id() ]);
              });


            }
          });

        }); // on dom ready

        return deferred.promise;
      };

      sushiGraph.listeners = {};

      function fire(e, args){
        var listeners = sushiGraph.listeners[e];

        for( var i = 0; listeners && i < listeners.length; i++ ){
          var fn = listeners[i];

          fn.apply( fn, args );
        }
      }

      function listen(e, fn){
        var listeners = sushiGraph.listeners[e] = sushiGraph.listeners[e] || [];

        listeners.push(fn);
      }

      sushiGraph.onClick = function(fn){
        listen('onClick', fn);
      };

      return sushiGraph;

    }]);

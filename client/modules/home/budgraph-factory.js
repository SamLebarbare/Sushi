'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('qibud.home')
    .factory('budGraph', [ '$q', function( $q ) {
      var cy;
      var budGraph = function(buds) {
        var deferred = $q.defer();

        // put buds model in cy.js
        var eles = [];
        for( var i = 0; i < buds.length; i++ ){
          eles.push({
            group: 'nodes',
            data: {
              id: buds[i].id,
              weight: 10,
              name: buds[i].title,
              faveColor: '#30426a',
              faveShape: 'circle'
            }
          });
        }

        for( var i = 0; i < buds.length; i++ ){
          if(buds[i].subBuds) {
            for( var s = 0; s < buds[i].subBuds.length; s++ ) {
              eles.push({
                group: 'edges',
                data: {
                  source: buds[i].id,
                  target: buds[i].subBuds[s].id,
                  faveColor: '#30426a',
                  strength: 1
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
                  'width': 'mapData(weight, 10, 10, 10, 10)',
                  'content': 'data(name)',
                  'text-valign': 'center',
                  'text-outline-width': 2,
                  'background-color': 'data(faveColor)',
                  'color': '#fff'
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
              name: 'cose',
              padding: 10
            },

            elements: eles,

            ready: function() {
              deferred.resolve( this );

              cy.on('cxtdrag', 'node', function(e){
                var node = this;
                var dy = Math.abs( e.cyPosition.x - node.position().x );
                var weight = Math.round( dy*2 );

                node.data('weight', weight);

                fire('onWeightChange', [ node.id(), node.data('weight') ]);
              });

              cy.on('click', 'node', function(e){
                var node = this;
                fire('onClick', [ node.id() ]);
              });


            }
          });

        }); // on dom ready

        return deferred.promise;
      };

      budGraph.listeners = {};

      function fire(e, args){
        var listeners = budGraph.listeners[e];

        for( var i = 0; listeners && i < listeners.length; i++ ){
          var fn = listeners[i];

          fn.apply( fn, args );
        }
      }

      function listen(e, fn){
        var listeners = budGraph.listeners[e] = budGraph.listeners[e] || [];

        listeners.push(fn);
      }

      budGraph.setBudWeight = function(id, weight){
        cy.$('#' + id).data('weight', weight);
      };

      budGraph.onWeightChange = function(fn){
        listen('onWeightChange', fn);
      };

      budGraph.onClick = function(fn){
        listen('onClick', fn);
      };

      return budGraph;

    }]);

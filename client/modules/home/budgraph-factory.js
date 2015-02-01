'use strict';
var cytoscape = require('cytoscape');
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
          var bud = buds[i];
          var info;


          if (bud.dataCache.state) {
            info = bud.title + ' (' + bud.dataCache.state + ')';
          }  else {
            info = bud.title;
          }

          eles.push({
            group: 'nodes',
            data: {
              id: bud.id,
              type: bud.typeInfo,
              weight: bud.qi,
              size: 100,
              picture: 'url(/images/'+ bud.type + '.png)',
              name: info,
              faveColor: '#30426a',
              faveShape: 'roundrectangle'
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
                  'color': '#fff',
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

      budGraph.onClick = function(fn){
        listen('onClick', fn);
      };

      return budGraph;

    }]);

'use strict';
var cytoscape = require('cytoscape');
/**
 * Home module for displaying home page content.
 */

angular
    .module('qibud.home')
    .factory('socialGraph', [ '$q', function( $q ) {
      var cy;

      var socialGraph = function(actors) {
        var deferred = $q.defer();
        var teams = actors.teams;
        var users = actors.users;
        // put actors model in cy.js
        var eles = [];
        for( var i = 0; i < teams.length; i++ ){
          var team = teams[i];

          eles.push({
            group: 'nodes',
            data: {
              id: team.id,
              type: 'Team',
              size: 100,
              name: team.name,
              picture: 'url(/images/Team.svg)',
              faveColor: '#30426a',
              faveShape: 'roundrectangle'
            }
          });
          console.log (team.name + ' ' + team.id);
        }

        for( var i = 0; i < users.length; i++ ){
          var user = users[i];

          eles.push({
            group: 'nodes',
            data: {
              id: 'x' + user.id,
              type: 'Member',
              size: 100,
              name: user.name,
              picture: 'url(data:image/png;base64,' + user.picture + ')',
              faveColor: '#45322a',
              faveShape: 'ellipse'
            }
          });

          console.log (user.name + ' ' + user.id);
        }

        for( var i = 0; i < teams.length; i++ ){
          for( var s = 0; s < teams[i].members.length; s++ ) {
            eles.push({
              group: 'edges',
              data: {
                source: teams[i].id,
                target: 'x' + teams[i].members[s].id,
                faveColor: '#30426a',
                strength: 1
              }
            });
            console.log (teams[i].id + ' ->' + teams[i].members[s].id);
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
                  'text-valign': 'top',
                  'content': 'data(name)',
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
                  'target-arrow-shape': 'circle',
                  'source-arrow-shape': 'triangle',
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
              name: 'circle',
              fit: true, // whether to fit the viewport to the graph
              padding: 30 // the padding on fit
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

      socialGraph.listeners = {};

      function fire(e, args){
        var listeners = socialGraph.listeners[e];

        for( var i = 0; listeners && i < listeners.length; i++ ){
          var fn = listeners[i];

          fn.apply( fn, args );
        }
      }

      function listen(e, fn){
        var listeners = socialGraph.listeners[e] = socialGraph.listeners[e] || [];

        listeners.push(fn);
      }

      socialGraph.onClick = function(fn){
        listen('onClick', fn);
      };

      return socialGraph;

    }]);

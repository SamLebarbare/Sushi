module.exports = {
  Idea : {
    id:'Idea',
    desc:'Starting point for innovation, can be primed',
    evolvableTo: ['Project','Action','Info'],
    defaultChilds: []
  },
  Info : {
    id:'Info',
    desc:'Share information',
    evolvableTo: ['Project','Action', 'Idea'],
    defaultChilds: []
  },
  Action : {
    id:'Action',
    desc:'Describe work and engage people under a project',
    evolvableTo: [],
    defaultChilds: ['Result']
  },
  Issue : {
    id:'Issue',
    desc:'Describe blocking points',
    evolvableTo: [],
    defaultChilds: ['Result', 'Action']
  },
  Result : {
    id:'Result',
    desc:'Set result of parent',
    evolvableTo: [],
    defaultChilds: []
  },
  Project : {
    id:'Project',
    desc:'Attach project to mission for defining the way to goal',
    evolvableTo: [],
    defaultChilds: ['Info', 'Idea', 'Action']
  },
  Meeting : {
    id:'Meeting',
    desc:'Meeting tool for reviewing bud',
    evolvableTo: [],
    defaultChilds: ['Info', 'Idea']
  },
  Mission : {
    id:'Mission',
    desc:'Define your strategy with some missions',
    evolvableTo: [],
    defaultChilds: ['Project', 'Info', 'Idea']
  },
  Team : {
    id:'Team',
    desc:'Create team for your organisation, team can be used to share bud to team members',
    evolvableTo: [],
    defaultChilds: ['Info', 'Idea']
  }
};

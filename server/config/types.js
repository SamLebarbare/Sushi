module.exports = {
  Idea : {
    id:'Idea',
    desc:'Starting point for innovation, can be primed',
    evolvableTo: ['Project','Action','Info'],
    defaultChilds: [],
    icon: 'mdi-image-wb-incandescent'
  },
  Info : {
    id:'Info',
    desc:'Share information',
    evolvableTo: ['Project','Action', 'Idea'],
    defaultChilds: [],
    icon: 'mdi-communication-message'
  },
  Action : {
    id:'Action',
    desc:'Describe work and engage people under a project',
    evolvableTo: [],
    defaultChilds: ['Result'],
    icon: 'mdi-image-flash-auto'
  },
  Issue : {
    id:'Issue',
    desc:'Describe blocking points',
    evolvableTo: [],
    defaultChilds: ['Result', 'Action'],
    icon: 'mdi-alert-warning'
  },
  Result : {
    id:'Result',
    desc:'Set result of parent',
    evolvableTo: [],
    defaultChilds: [],
    icon: 'mdi-action-thumbs-up-down'
  },
  Project : {
    id:'Project',
    desc:'Attach project to mission for defining the way to goal',
    evolvableTo: [],
    defaultChilds: ['Info', 'Idea', 'Action'],
    icon: 'mdi-action-assignment'
  },
  Meeting : {
    id:'Meeting',
    desc:'Meeting tool for reviewing bud',
    evolvableTo: [],
    defaultChilds: ['Info', 'Idea'],
    icon: 'mdi-av-movie'
  },
  Mission : {
    id:'Mission',
    desc:'Define your strategy with some missions',
    evolvableTo: [],
    defaultChilds: ['Project', 'Info', 'Idea'],
    icon: 'mdi-action-class'
  },
  Team : {
    id:'Team',
    desc:'Create team for your organisation, team can be used to share bud to team members',
    evolvableTo: [],
    defaultChilds: ['Info', 'Idea'],
    icon: 'mdi-social-people'
  }
};

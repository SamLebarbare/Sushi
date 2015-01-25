module.exports = {
  Idea : {
    id:'Bud',
    desc:'Evolve me!',
    defaultChilds: [],
    icon: 'mdi-image-wb-incandescent'
  },
  Idea : {
    id:'Idea',
    desc:'Starting point for innovation, can be primed',
    defaultChilds: [],
    icon: 'mdi-image-wb-incandescent'
  },
  Info : {
    id:'Info',
    desc:'Share information',
    defaultChilds: [],
    icon: 'mdi-communication-message'
  },
  Action : {
    id:'Action',
    desc:'Describe work and engage people under a project',
    defaultChilds: ['Result'],
    icon: 'mdi-image-flash-auto'
  },
  Issue : {
    id:'Issue',
    desc:'Describe blocking points',
    defaultChilds: ['Result', 'Action'],
    icon: 'mdi-alert-warning'
  },
  Result : {
    id:'Result',
    desc:'Set result of parent',
    defaultChilds: [],
    icon: 'mdi-action-thumbs-up-down'
  },
  Project : {
    id:'Project',
    desc:'Attach project to mission for defining the way to goal',
    defaultChilds: ['Info', 'Idea', 'Action'],
    icon: 'mdi-action-assignment'
  },
  Meeting : {
    id:'Meeting',
    desc:'Meeting tool for reviewing bud',
    defaultChilds: ['Info', 'Idea'],
    icon: 'mdi-av-movie'
  },
  Mission : {
    id:'Mission',
    desc:'Define your strategy with some missions',
    defaultChilds: ['Project', 'Info', 'Idea'],
    icon: 'mdi-action-class'
  },
  Team : {
    id:'Team',
    desc:'Create team for your organisation, team can be used to share bud to team members',
    defaultChilds: ['Info', 'Idea'],
    icon: 'mdi-social-people'
  }
};

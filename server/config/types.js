module.exports = {
  Bud : {
    id:'Bud',
    desc:'Evolve me!',
    defaultChilds: [],
    icon: 'fa fa-leaf',
    xp: 20,
    evolve: true
  },
  Idea : {
    id:'Idea',
    desc:'Starting point for innovation, can be primed',
    defaultChilds: [],
    icon: 'mdi-image-wb-incandescent',
    skills: {
      creator: 'Creativity'
    },
    evolve: true
  },
  Info : {
    id:'Info',
    desc:'Share information',
    defaultChilds: [],
    icon: 'mdi-communication-message',
    skills: {
      creator: 'Informator'
    },
    evolve: true
  },
  Action : {
    id:'Action',
    desc:'Describe work and engage people under a project',
    defaultChilds: ['Result'],
    icon: 'mdi-image-flash-auto',
    skills: {
      creator: 'Organisation'
    },
    evolve: true
  },
  Issue : {
    id:'Issue',
    desc:'Describe blocking points',
    defaultChilds: ['Result', 'Action'],
    icon: 'mdi-alert-warning',
    skills: {
      creator: 'Problem finder'
    },
    evolve: true
  },
  Result : {
    id:'Result',
    desc:'Set result of parent',
    defaultChilds: [],
    icon: 'mdi-action-thumbs-up-down',
    evolve: true
  },
  Project : {
    id:'Project',
    desc:'Attach project to mission for defining the way to goal',
    defaultChilds: ['Info', 'Idea', 'Action'],
    icon: 'mdi-action-assignment',
    skills: {
      creator: 'Organisation'
    },
    evolve: true
  },
  Meeting : {
    id:'Meeting',
    desc:'Meeting tool for reviewing bud',
    defaultChilds: ['Info', 'Idea'],
    icon: 'mdi-av-movie',
    evolve: false
  },
  Mission : {
    id:'Mission',
    desc:'Define your strategy with some missions',
    defaultChilds: ['Project', 'Info', 'Idea'],
    icon: 'mdi-action-class',
    skills: {
      creator: 'Strategy'
    },
    evolve: false
  },
  Team : {
    id:'Team',
    desc:'Create team for your organisation, team can be used to share bud to team members',
    defaultChilds: ['Info', 'Idea'],
    icon: 'mdi-social-people',
    evolve: false
  }
};

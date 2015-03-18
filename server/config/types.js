module.exports = {
  Sushi : {
    id:'Sushi',
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
      creator: 'Creativity',
      actor: 'Realisator'
    },
    evolve: true
  },
};

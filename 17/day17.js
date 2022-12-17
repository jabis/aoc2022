const day16 = async (i) => {
    i = i.replace(/\r\n/g, '\n');
    i = i.split('\n');
    let moves = i.split('');
    let blocks = [
        [
          ['@','@','@','@']
        ],
        [
          ['.','@','.'],
          ['@','@','@'],
          ['.','@','.']
        ],
        [
         ['@'],
         ['@'],
         ['@'],
         ['@']
        ]
      ]
    return {moves,blocks};
  };
  module.exports = day16;
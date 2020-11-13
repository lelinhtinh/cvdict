const shell = require('shelljs');

function updateContent(file) {
  console.log('Update content', file);

  shell.sed('-i', /(<i>)\1+/g, '', file);
  shell.sed('-i', /<IMG [^>]+?>/g, '', file);
  shell.sed('-i', /<A href="[^">]+?\.js.?"><\/A>/g, '', file);
  shell.sed('-i', /<SPAN[^>]*>(.(?!<\/OBJECT>))*.<\/OBJECT>/g, '', file);
  shell.sed('-i', /<STYLE[^>]*>(.(?!<\/STYLE>))*.<\/STYLE>/g, '', file);
  shell.sed(
    '-i',
    /<TD width=18>&nbsp;<\/TD>/g,
    '<span style="display:inline-block;width:1em">&nbsp;&nbsp;</span>',
    file
  );
  shell.sed(
    '-i',
    /<TD colspan=2[^>]*>&nbsp;<\/TD>/g,
    '<span style="display:inline-block;width:2em">&nbsp;&nbsp;</span>',
    file
  );
  shell.sed(
    '-i',
    /<TD colspan=3[^>]*>&nbsp;<\/TD>/g,
    '<span style="display:inline-block;width:3em">&nbsp;&nbsp;&nbsp;&nbsp;</span>',
    file
  );
  shell.sed(
    '-i',
    /<TD colspan=4[^>]*>&nbsp;<\/TD>/g,
    '<span style="display:inline-block;width:4em">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',
    file
  );
  shell.sed('-i', /<TD colspan=\d><HR><\/TD>/g, '<hr>', file);
  shell.sed('-i', /<TD[^>]*><\/TD>/g, '<span>&nbsp;</span>', file);
  shell.sed('-i', /<TABLE[^>]*>/g, '<div>', file);
  shell.sed('-i', /<TR[^>]*>/g, '<div>', file);
  shell.sed('-i', /<TD[^>]*>/g, '', file);
  shell.sed('-i', /<\/TD>/g, '', file);
  shell.sed('-i', /<\/TR>/g, '</div>', file);
  shell.sed('-i', /<\/TABLE>/g, '</div>', file);
  shell.sed(
    '-i',
    /<font color=([^>\s]+)><b>(.)<\/b><\/font>/g,
    '<span style="display:inline-block;width:1em;text-align:center;color:$1">$2</span>',
    file
  );
}

function convert(file) {
  const dict = file.replace(/old\/(.*?)\.zip$/, '$1');
  console.log('Convert', dict);

  shell.exec(`./dictutil unpack --output temp ${file}`);

  shell.cd('temp');
  shell.ls('*.html').forEach(updateContent);
  shell.cd('..');

  shell.exec(`./dictutil pack --output "${dict}.zip" temp`);
  shell.rm('-rf', 'temp');
}

function init() {
  shell.ls('old/*.zip').forEach(convert);
}

try {
  init();
} catch (error) {
  console.error(error);
}

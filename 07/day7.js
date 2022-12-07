class FileSystemStateMachine {
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
    this.currentPath = '/';
    this.previousCommand = [];
    this.folderSizes={}
    this.diskspace = 70_000_000;
    this.usedspace = 0;
    this.updaterequires = 30_000_000;
  }
  reset(){
    this.fileSystem = {'/':{}};
    this.currentPath = '/';
    this.previousCommand = ['reset'];
    this.folderSizes={}
    this.diskspace = 70_000_000;
    this.usedspace = 0;
    this.updaterequires = 30_000_000;
  }
  execute(command) {
    const [commandName, ...args] = command.split(' ');
    this.previousCommand = [commandName, ...args];
    if (commandName === 'mkdir') {
      this.mkdir(args[0]);
    } else if (commandName === 'rmdir') {
      this.rmdir(args[0]);
    }  else if (commandName === 'cd') {
      this.cd(args[0]);
    } else if (commandName === 'ls') {
      this.ls();
    } else if (commandName === 'add') {
      this.add(args[0], args[1]);
    } else if (commandName === 'del') {
      this.del(args[0]);
    } else {
      // Handle unknown commands
      console.log(`Unknown command: ${commandName}`);
    }
  }

  getPreviousCommand(){
    return this.previousCommand;
  }
  getSubfolderSizes(p=false) {
    p = !p ? this.currentPath : p;
    const subfolderSizes = {};
    //console.log(p)
    let totalSize = 0,
      curr = this.fileSystem[p];
    const subfolderNames = Object.keys(curr);
    for (const subfolderName of subfolderNames) {
      let subfolderPath = p+'/'+subfolderName;
      subfolderPath = subfolderPath.replace('\/\/','/')
      if (this.fileSystem[p][subfolderName] instanceof Object) {
        const subfolderSize = this.getSubfolderSizes(
          subfolderPath
        );
        subfolderSizes[subfolderPath] = {children:subfolderSize.children, total:subfolderSize.total};
        totalSize += subfolderSize.total;
      } else {
        const subfolderSize = this.fileSystem[p][subfolderName];
        subfolderSizes[subfolderPath] = subfolderSize;
        totalSize += subfolderSize;
      }
    }
    return { children: subfolderSizes, total:totalSize };
  }
  
  getBySize(size, comparison = '=', recursive = true, path=false) {
    path = !path ? this.currentPath : path;
    const currentDir = this.fileSystem[path];
    console.log(size,comparison,recursive,path);
    function traverse(directory) {
      const matches = [];
      console.log('iterating', directory)
      for (const [name, file] of Object.entries(directory)) {
        console.log("name",name,"file",file)
        if (file instanceof Object && recursive) {
          matches.push(...traverse(file));
        } else {
          if (comparison === '>' && file > size) {
            matches.push([name, file]);
          } else if (comparison === '<' && file < size) {
            matches.push([name, file]);
          } else if (comparison === '=' && file === size) {
            matches.push([name, file]);
          }
        }
      }

      return matches.filter(i=>{ return i ? i : false});
    }
    const files = traverse(currentDir);
    return files;
  }
  cd(path) {
    if(path=="/"||path==""){
      this.currentPath = '/';
      return;
    }
    const segments = path.split('/');
    for (const segment of segments) {
      if (segment === '') continue;
      if (segment === '..') {
        let next = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
        if(next === '') next = '/';
        this.currentPath = next;
      } else {
        let next = this.currentPath += `/${segment}`;
        this.currentPath = next.replace('//','/');
      }
    }
  }

  ls() {
    const currentDir = this.fileSystem[this.currentPath];
    if(!currentDir) return;
    if (currentDir) {
      console.log(this.currentPath)
      let s = this.folderSizes[this.currentPath];
      console.log(`Folder Size: ${s}`);
    }
    const files = Object.entries(currentDir).map(([name, size]) => {
      if(typeof size =="object"){
        size = `dir`;
      }
      return `${name} (${size})`;
    });
    return files;
  }

  mkdir(name) {
    const newDir = { [name]: { } };
    this.fileSystem[this.currentPath] = {
      ...this.fileSystem[this.currentPath],
      ...newDir,
    };
    this.folderSizes[this.currentPath] = 0;
  }
  flow(path='/',size,method='add'){
    if(path=="" || path=='/') {
      this.folderSizes['/'] +=parseInt(size)
      return;
    };
    path = path.substring(0, path.lastIndexOf('/'));
    if(path=="") path = '/';
    if(!this.folderSizes[path]) this.folderSizes[path] = 0;
    if(method=="add"){
      this.folderSizes[path] += parseInt(size);
    } else if(method == "del"){
      this.folderSizes[path] -= parseInt(size);
    } else if(method == "set"){
      this.folderSizes[path] = parseInt(size);
    } else {
      //no-op
    }
    this.flow(path,size,method);
  }
  add(size, name) {
    let s = parseInt(size);
    this.fileSystem[this.currentPath] = {
      ...this.fileSystem[this.currentPath],
      [name]: s,
    };
    if(!this.folderSizes[this.currentPath]) this.folderSizes[this.currentPath] = 0;
    this.folderSizes[this.currentPath] +=s;
    this.usedspace+=s;
    this.flow(this.currentPath, s,'add'); 
  }
  del(name){
    let s = 0;
    this.fileSystem[this.currentPath] = {};
    if(!this.folderSizes[this.currentPath]) this.folderSizes[this.currentPath] = 0;
    this.folderSizes[this.currentPath] -=s;
    this.usedspace-=s;
    this.flow(this.currentPath, s,'del'); 
  }
  rmdir(path){
    path = path ? path : this.currentPath;
    this.currentPath = path;
    console.log("rming",this.fileSystem[path], this.folderSizes[path]);
    //this.flow(this.currentPath, s,'del'); 
  }
}
const day7 = async (input) => {
  input = input.replace(/\r\n/g, '\n');
  const fileSystem = {
    '/': {},
  };
  const fsm = new FileSystemStateMachine(fileSystem);
  //i = i.split('\n');
  return {fsm,input};
};
module.exports = day7;
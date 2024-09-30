import { Command } from "../src/command";

describe('test default command', () => {
  let cmd: Command
  beforeEach(async () => {
    cmd = (await import('./demo')).getCmd()
  })

  // ----- set default command or arg --------
  it(`sub command show help when '--help' flag is present`, () => {
    const subCmd = cmd.sub(['i,in, install <lodash>'], () => {
      console.log('install action run');
    })
    const argv = ['i', '--help'];
    const mockHelp = vi.spyOn(subCmd, 'help')
    cmd.run(argv);
    expect(mockHelp).toHaveBeenCalledOnce()
  });

  // ----- set default command or arg --------
  it('run main default command when default command set', () => {
    cmd.sub(['i,in, install <lodash>'], () => {
      console.log('install action run');
    })

    cmd.sub(['a,ax, axxxx <sss>'], () => {
      console.log('axxxx');
    })
    cmd.default(
      ['...x'],
      ['pkg!'],
      ['...files']
    )
    // cmd.default('[pkg!|array]]')

    cmd.defineAction((a, b) => {
      expect(a).toEqual({
        '--': [],
        _: [],
        run: 'run default value',
        target: 'target default value',
      });
      expect(b).toEqual({
        files: ['a.js', 'b.js', 'c.js', 'd.js'],
        x: ['xxx'],
        pkg: 'a.ts',
      });
    })

    cmd.argv = ['xxx', 'a.ts', 'a.js', 'b.js', 'c.js', 'd.js'];
    cmd.run();
  });

  it('[1] sub default command should work correctly', () => {
    cmd.sub(
      ['i,in, install [pkg!, ...files]', 'install"s description'],
      [
        ['flag!', 'recursive desc', false],
        ['r,-recursive', 'recursive desc', false],
      ],
      (a, b) => {
        // a : args , b: [pkg, files]
        console.log(a, b);
        expect(a).toEqual({
          '--': [],
          _: [],
          recursive: true
        })
        expect(b).toEqual({
          pkg: 'axios',
          files: ['a.ts', 'a.js', 'b.js', 'c.js', 'd.js']
        })
      })

    cmd.run(['-r']);
  });

  it('[2] sub default command should work correctly', () => {
    cmd.sub(
      ['i,in, install', 'install"s description'],
      [
        ['!flag!', 'recursive desc', false],
        ['r,!recursive', 'recursive desc', false],
      ],
      (a, b) => {
        // a : args , b: [pkg, files]
        console.log(`xxxxx`, a, b);
        expect(a).toEqual({
          '--': [],
          _: ['xxx'],
          flag: true,
          recursive: true,
          n: true
        })
        // expect(b).toEqual({
        //   pkg: 'axios',
        //   files: ['f1', 'f2']
        // })
      }).default(
        ['pkg!', 'pkg desc'],
        ['...files', 'files desc'],
      )

    cmd.argv = ['i', 'axios', 'f1', 'f2', '-r', '--flag', 'true', '-n', 'xxx'];
    cmd.run();
  });

  it('[3] sub default command should work correctly', async () => {
    cmd
      .sub(
        ['i,in, install', 'install"s description'],
        [
          ['flag!', 'recursive desc', 'x'],
          ['r,!recursive', 'recursive desc', false],
        ],
        (a, b) => {
          expect(a).toEqual({
            '--': [],
            _: ['f2', 'xxx'],
            recursive: true,
            flag: 'test',
            n: true
          })
          expect(b).toEqual({
            pkg: 'axios',
            yu: 'x',
            file: 'f1'
          })
          return a
        })
      .default(
        ['pkg!'],
        ['yu'],
        ['file']
      )

    const argv = ['i', 'axios', 'x', 'f1', 'f2', '-r', '--flag', "test", '-n', 'xxx'];
    const a = await cmd.run(argv);
    console.log(`axxa`, a)
  });

  it('Run with boolean flag start should work', async () => {
    cmd.sub(
      ['i,in, install', 'install"s description'],
      [
        ['!flag', 'recursive desc', 'x'],
        ['r,!recursive', 'recursive desc', false],
      ],
      (a, b) => {
        // a : args , b: [pkg, files]
        console.log(`xxx`, a, b);
        expect(a).toEqual({
          '--': [],
          _: ['f2', 'xxx', 'test'],
          recursive: true,
          flag: false,
          n: true
        })
        expect(b).toEqual({
          pkg: 'axios',
          file: 'f1'
        })
        return { a, b }
      }).default(
        ['pkg!'], ['file']
      )

    // cmd.argv = ['node', 'app', 'in', '-r', 'axios', 'f1', 'f2', '--flag', "test", '-n', 'xxx'];
    const d = await cmd.run(['install', '-r', 'axios', 'f1', 'f2', '--flag', "test", '-n', 'xxx']);
    console.log(`xxx`, d)
  });
})

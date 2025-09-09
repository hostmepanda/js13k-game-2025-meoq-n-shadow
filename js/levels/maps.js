import {GAME_STATE} from '../consts'
/*
  '#': 'yellow'  # = level exit
  'A': 'blue'  fish
  'B': 'purple'  B = boss
  'C': 'black'  C = ceiling
  'D': 'darkred'  D = door
  'E': 'red'  E = enemy
  'F': 'darkgreen'  F = floor
  'L': 'yellow'  L = lamp
  '2': 'white'  white cat
  'O': 'lightblue'  O = window
  'P': 'brown'  P = poop
  'R': 'saddlebrown'  R = wardrobe
  '1': 'black'  black cat
  'T': 'peru'  T = table
  'W': 'brown'  W = wall
  'X': 'gray'  X = breakable wall
  'c': 'sienna'  c = chair
  'Q': 'green'  Q = flower
  'f': 'darkgreen', // f - invisible when boss is alive
 */


export const LEVEL_MAPS = {
  [GAME_STATE.LEVEL1]: [
    // 39 F one screen width
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "N.....................X...................................................a.....X....................................................................W.............M..................a..X.............N",
    "N...12................X.........................................................X........................A...........................................W.............M.....................X.............N",
    "N....#............a...NFFFFffffffffffffffffffffffffffffffffff............f......fffffffffffffffffffffffffff..........................................W.............M..........ff.........F.............N",
    "N...FF...........FFfffN..................................FFFFffff...............f.........................ffffffffffffff.............................mmmmmmmmmmmmmmm..........NN.........N.............N",
    "N.....................X.....................................FFFFFffff...........fFFFFFFFFFFF............................fffffffffffffXXXXX........aa................XXXXfffffffffffffffffN.............N",
    "N.....................XXX.......Aa...................................ffff.......f...................................................XXXXXXffffffff.................a................d....N.............N",
    "N.....Q.B.............XXX...........D...............Q........D............fffffff.......Dd..T.dD..................................d..X.............ffffffffffffff......Q............T.....N.............N",
    "nFFFFFFFFFFFFFFFFFFFFFFFXXXXFXXFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF....FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF....FFF...FFFF............FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF........N",
    "nmmmmmmmmmmmmmmmmmmmmmmXXXXXXXXmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm....mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm....mmm...mmmm...............mmmmmmmmmmmmmmmmmmmmmmmmmmmmN........N",
    "N............................ff..........................................................................................................................................................N.............N",
    "N.......................ff...........................................................................................................ff............FFFFXXXXFFFF..........................N.........d...N",
    "N.........................f............................................................................................................ff......................FFFFFFF...................N...ffffffffffN",
    "N..........................f....ff.......................................................................................................ff..........................W...................N.............N",
    "N..........a.......................f.......................................................................................................ff........................WFF.................N.............N",
    "N..........F..................ff.....f.......................................................................................................ff..................mmmmW...................Nffffffffff...N",
    "N...d......M...............Q............................................D.......................................d................................Q..................................Q....N...........##N",
    "N...T.D....M.D.D....d......T.d...............Dd.Q.......................TQ....................................d.T.......................Dd.......T...................................T...N......D....##N",
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ],
  [GAME_STATE.LEVEL2]: [
    // 39 F one screen width
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    ".....................................................................................................................................................................X.........MOOmM.a.....XXXXXXXXX....",
    "..Q..................................................F.................................................A..........12..........................................a......X.........MOOmM.......XXXXXXXXX....",
    "wwwwN........................................................A...FFF.F..............................XX...mFFFFFFFFFM..............................ff.....ff..........X.........MOOmM.......XXXXXXXXXFFFF",
    "nWWnN.............................................F........F.F.F......A.......................A.F...XX...mnWOOmOOmwM...................a...ff...f...........ff...ffffMfffffff..MOOmM.......XXXXXXXXXnWWn",
    "MOOmN.................................................F...............F....X..A..X..FXXXXXF.........XX..FmnWOOmOOmwM...............ff....f..........................mM.........nwwnnFFFF...FFFFXXXXXMOOm",
    "MOOmN............A.........................................................X.....X............A.....XX...mnWOOmOOmwM................................................mM.........WnnWnnWnM...nWnMXXXXXMOOm",
    "nwwnN.............................................F........................F.....F..................XX...mnWOOmOOmwM....................................ff..........mM...ffffffWnMOmMOmM...MOmMXXXXXWwwn",
    "nWWnN..................Q.........Q.........................A........................................wwwwwwwwwwwwwwwM..........ff...a................................mM...mnnnnnWnnwnnwnM..fnwnM........m",
    "MOOmN................FFFFFFFFFFFFFFF.................F.....F.....F............................XX....mnOmOmOmOmOmOmwM...............ff...........a...................mM...mnnnnnWnnWnnWnM...nWnM...a....m",
    "MOOmN................nWWnnWWn..nWWnN..........................................................XX....mnOmOmOmOmOmOmwM........FF............ff....ff...........FF.....mM.........WnMOmMOmM...MOmM........m",
    "nwwnN................MOOmMOOm..MOOmN.................................FF...A...................XX....mFFFFFFFFFFFFFFM.....................................a..........mM.........WnnwnnwnMf..nwnM..ff...Qm",
    "nnnnN................MOOmMOOm..MOOmN......................................FF..................XX..Q.mwwwwwwwwwwwwwwMFFF..............FF............FF....ff.......FFmM.........X...........nWnM.......fm",
    "nN..............FFFF.nwwnnwwn..nwwnN................Q...A...Q.................................mwwwwwnnOnOnOnOnOnWWnM................................................mM.........X...........MOmM........m",
    "nN............FFnWWn.nWWnnWWn..nWWnN...............FFFFFFFFFFF................................mnWWWnnWWnnWWWWnnMOOmM...........B.............B.....a.....B...ff.....mM.........wwwwwwwwwwwwnwnM.......Qm",
    "nnFFF.........mnMOOm.MOOmMOOm..MOOmN...............N...mN...mN.......A......FF...A............mNOOOnMOOmnOOmOOnMOOmM..........QQ............QQ..........QQ..........mM....a..ffWnnWWnnWnnWnnWnM.......fm",
    "nnnnN.........mnMOOm.MOOmMOOm..MOOmN...............N...mN...mN................................mNOOOnMwwmnOOmOOnMOOmM..........mM............mM..........mM..........mMff.......WnMOOmMOmMOmMOmM........m",
    "nnnnN.......Q.mnnwwn.nwwnnwwn..nwwnN.Q.D....Q....D.Ndd.mNdd.mN.D.....mM...D...........Q...d...mnwwwnnnnnnnnnnnnMOOmM..........mM............mM..........mM..........mM.........WnnwwnnwnnwnnwnMFFXXXXFFm",
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFmnnnnnnnnnnnnnnnnnwwnMnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn####nnn"
  ],
  [GAME_STATE.LEVEL3]: [
    // 39 F one screen width
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "WFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W.....................S..................................................................................................................................................M.............................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ],
  [GAME_STATE.LEVEL4]: [
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "WFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W.....................S..................................................................................................................................................M.............................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "W......................................................................................................................................................................................................W",
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ],
};
import * as connections from '.'

export async function connectionTest() {
  for (const [name, pool] of Object.entries(connections)) {
    await pool.query('select 1')
    console.log(name.toUpperCase(), 'connected')
  }
}

export async function setNamesUtf8() {
  for (const [name, pool] of Object.entries(connections)) {
    if (name === 'DB_CUBE_FLOW') {
      await pool.query('set names utf8')
      console.log(name.toUpperCase(), 'Set Names UTF8')
    }
  }
}

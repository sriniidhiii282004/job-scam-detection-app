const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');
const { readData, writeData } = require('./util');

async function getAll() {
  const storedData = await readData();
  if (!storedData.jobs) {
    console.log('stored data=====', storedData);
    
    throw new NotFoundError('Could not find any jobs.');
  }
  return storedData.jobs;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.jobs || storedData.jobs.length === 0) {
    throw new NotFoundError('Could not find any jobs.');
  }

  const job = storedData.jobs.find((ev) => ev.id === id);
  if (!job) {
    throw new NotFoundError('Could not find job for id ' + id);
  }

  return job;
}

async function add(data) {
  const storedData = await readData();
  storedData.jobs.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.jobs || storedData.jobs.length === 0) {
    throw new NotFoundError('Could not find any jobs.');
  }

  const index = storedData.jobs.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError('Could not find job for id ' + id);
  }

  storedData.jobs[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.jobs.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, jobs: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
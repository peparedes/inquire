#!/usr/bin/env python2

from bs4 import BeautifulSoup
import csv
import sys
import glob
import os.path
# import h5py
# import hdf5storage
from multiprocessing import Pool

# print(sys.argv)
folder = sys.argv[1]
# folder = '00'

outdir = sys.argv[2]

fname_out = '{}/meta_{}.csv'.format(outdir, os.path.basename(folder))
# fname_out = 'meta_{}.hdf5'.format(folder)

fieldnames=['user', 'subject', 'ditemid', 'event_timestamp', 'current_moodid']

fnames = sorted(glob.glob('{}/*'.format(folder)))

def process_file(fname):
    with open(fname, 'r') as f:
        text = f.read()

    soup = BeautifulSoup(text, "lxml")
    _ = [s.extract() for s in soup('base64')]


    arr = []

    for post in soup.find_all('post'):
        d = {}
        d['user'] = post.find('user').text
        d['ditemid'] = post.find('ditemid').text
        # d['url'] = post.find('url').text
        d['event_timestamp'] = post.find('event_timestamp').text

        try:
            d['subject'] = post.find('subject').text
        except AttributeError:
            d['subject'] = ''

        try:
            d['current_moodid'] = post.find('current_moodid').text
        except AttributeError:
            d['current_moodid'] = '-1'

        arr.append(d)

    return arr
    

p = Pool(4)
results = p.map(process_file, fnames)
total = len(fnames)

writer_f = open(fname_out, 'w')
delimiter='\t'
writer = csv.DictWriter(writer_f, fieldnames=fieldnames, delimiter=delimiter,
                        quotechar=delimiter, lineterminator='\n')
writer.writeheader()

# options = hdf5storage.Options(matlab_compatible=True, store_python_metadata=False)

count = 0

for i, arr in enumerate(results):
    # sys.stderr.write('\rdone {0:%} ({1:d}/{2:d}) ({3} posts)'.format(
    #     float(i)/total, i, total, count))
    # sys.stderr.flush()

    count += len(arr)
    
    for d in arr:
        d['subject'] = d['subject'].replace(delimiter, '')
        writer.writerow(d)

    writer_f.flush()

sys.stderr.write('\rdone processing {} ({} files, {} posts)                 \n'.format(
    folder,total, count))
sys.stderr.flush()







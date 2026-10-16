"""Transparent, *estimated* CEFR suggestions, not accredited CEFR classification.

No open dataset provides an objective CEFR level for every word across all three
languages. We deliberately call them estimates on the site. Source data can
supply explicit CEFR labels in a future version; those should supersede this.
"""
import re
LEVELS=('A1','A2','B1','B2','C1','C2')
BEGINNER='''hello goodbye please thank thanks yes no mother father brother sister family house home school teacher student book pen pencil desk chair door window water bread milk coffee tea food fruit meat fish apple banana egg rice breakfast lunch dinner cat dog bird red blue green black white yellow big small good bad happy sad hot cold warm new old young tall short beautiful ugly nice easy hard left right here there today tomorrow yesterday morning evening night day week month year one two three four five six seven eight nine ten first last man woman boy girl child friend name age time money work job play read write speak talk listen learn study eat drink sleep go come stay live love like want need have do make can is are be see look know think say tell ask help walk run bus train car taxi plane airport ticket passport hotel street town city country language english french italian spanish music song movie film shopping shop store market buy sell pay price cheap expensive clothes shirt shoes family friend phone computer internet email doctor hospital medicine health body head eye ear nose mouth hand foot arm leg weather rain sun snow wind summer winter spring autumn hello sorry excuse me pardon'''.split()
BASIC='''restaurant supermarket apartment room bathroom kitchen bedroom garden park beach river sea mountain holiday vacation trip travel journey suitcase luggage reservation reception kitchen dinner lunch menu waiter waitress order bill receipt change university lesson homework exam test library office meeting project business company employee employer colleague manager engineer lawyer police politics government election vote parliament president democracy law court judge news newspaper journalist radio television science experiment laboratory technology software application website machine laptop mouse keyboard photograph camera photo painting picture actor actress director cinema sport football tennis basketball swimming dance theatre festival birthday marriage wedding relationship husband wife partner kitchen garden bicycle bike ship boat plane station museum village hotel'''.split()
ADVANCED_TOPICS={'politics','law','business','science','technology','history','idioms'}
FUNDAMENTALS={'colors','numbers','family','body','home','weather','animals','daily','phrases'}
BEGINNER_SET=set(BEGINNER);BASIC_SET=set(BASIC)
try:
    from wordfreq import zipf_frequency as _zipf
except ImportError:
    _zipf=None

def english_frequency(word):
    """Use an installed wordfreq package if available; else give None."""
    if _zipf is None:return None
    try:return float(_zipf(word,'en'))
    except (ValueError,TypeError):return None


def estimate_level(english,topic,rank=None):
    """Return suggestion from English form/domain and *optional* word frequency.

    If rank is provided it is an externally sourced wordfreq Zipf score 1–7.
    Frequency is not the same as CEFR; this is only a sorting aid.
    """
    e=english.lower().strip(); core=re.sub(r'^(to |the |a |an )','',e)
    if core in BEGINNER_SET or e in BEGINNER_SET:return 'A1'
    if core in BASIC_SET or e in BASIC_SET:return 'A2'
    if rank is not None:
        if rank>=5.65:return 'A1'
        if rank>=5.0:return 'A2'
        if rank>=4.35:return 'B1'
        if rank>=3.7:return 'B2'
        if rank>=3.0:return 'C1'
        return 'C2'
    tokens=len(e.split()); letters=sum(c.isalpha() for c in e)
    if topic=='idioms':return 'B2' if tokens<=5 else 'C1'
    if topic in ADVANCED_TOPICS:
        if letters>17:return 'C1'
        if letters>11:return 'B2'
        return 'B1'
    if topic in FUNDAMENTALS:
        return 'A2' if letters<10 else 'B1'
    if tokens>4:return 'B2'
    if tokens>2:return 'B1'
    if letters>15:return 'C1'
    if letters>10:return 'B2'
    return 'B1'

# ! /bin/bash
# vim: set expandtab tabstop=4 shiftwidth=4 foldmethod=marker: #

declare -r __PATH=`pwd`
declare -r __ROOT="$(cd -- $(dirname -- ${0}) && pwd)"
declare -r MEMCACHE="${__ROOT}/bin/memcached"

if [ ! -d "${__ROOT}/bin" ] ; then
    mkdir -p "${__ROOT}/bin"
fi

# {{{ function install_memcached() #
install_memcached() {
    if [ -d "${__ROOT}/tmp" ] ; then
        /bin/rm -rf "${__ROOT}/tmp"
    fi

    mkdir -p "${__ROOT}/tmp"
    cd "${__ROOT}/tmp" && \
        wget --no-check-certificate "https://github.com/downloads/libevent/libevent/libevent-2.0.18-stable.tar.gz" && \
        tar zxvf ./libevent-2.0.18-stable.tar.gz && cd libevent-2.0.18-stable && \
        ./configure --prefix=${__ROOT}/bin/libevent && make && make install && \
        cd "${__ROOT}/tmp" && \
        wget "http://memcached.googlecode.com/files/memcached-1.4.13.tar.gz" && \
        tar zxvf ./memcached-1.4.13.tar.gz && cd memcached-1.4.13 && \
        ./configure --with-libevent=${__ROOT}/bin/libevent && make && \
        cp ./memcached "${MEMCACHE}" && chmod +x "${MEMCACHE}" && \
        /bin/rm -rf ${__ROOT}/tmp
}
# }}} #

if [ ! -f "${MEMCACHE}" ] ; then
    install_memcached
fi

${MEMCACHE} -d -p11211

cd "${__PATH}"
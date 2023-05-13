FROM postgres:14-bullseye

ENV POSTGIS_MAJOR 3

RUN echo "deb http://ftp.us.debian.org/debian sid main" >> /etc/apt/sources.list \
  && apt-get update \
  && apt-cache showpkg postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR \
  && apt-get install -y --no-install-recommends \
       postgresql-14-postgis-$POSTGIS_MAJOR postgresql-14-postgis-$POSTGIS_MAJOR-scripts \
  && rm -rf /var/lib/apt/lists/* \
  && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8
